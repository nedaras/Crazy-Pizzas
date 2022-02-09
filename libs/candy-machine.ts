import { Program, Provider } from '@project-serum/anchor'
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import {
    Blockhash,
    Commitment,
    Connection,
    FeeCalculator,
    Keypair,
    PublicKey,
    RpcResponseAndContext,
    SignatureStatus,
    SimulatedTransactionResponse,
    SystemProgram,
    SYSVAR_CLOCK_PUBKEY,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
    TransactionSignature,
} from '@solana/web3.js'
import { CandyMachine } from '../@types/candy-machine'

const CANDY_MACHINE_PROGRAM = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ')
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

interface Accounts {
    pubkey: PublicKey
    isWritable: boolean
    isSigner: boolean
}

enum SequenceType {
    Sequential,
    Parallel,
    StopOnFailure,
}

interface BlockhashAndFeeCalculator {
    blockhash: Blockhash
    feeCalculator: FeeCalculator
}

export const mint = async (candyMachine: CandyMachine, payer: PublicKey): Promise<string | null> => {
    const mint = Keypair.generate()

    const userTokenAccountAddress = (await getAtaForMint(mint.publicKey, payer))[0]
    const userPayingAccountAddress = candyMachine.state.tokenMint ? (await getAtaForMint(candyMachine.state.tokenMint, payer))[0] : payer

    const remainingAccounts: Accounts[] = []
    const signers = [ mint ]
    const cleanupInsructions = []
    const instructions = [
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mint.publicKey,
            space: MintLayout.span,
            lamports: await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(MintLayout.span),
            programId: TOKEN_PROGRAM_ID,
        }),
        Token.createInitMintInstruction(TOKEN_PROGRAM_ID, mint.publicKey, 0, payer, payer),
        createAssociatedTokenAccountInstruction(userTokenAccountAddress, payer, payer, mint.publicKey),
        Token.createMintToInstruction(TOKEN_PROGRAM_ID, mint.publicKey, userTokenAccountAddress, payer, [], 1),
    ]

    if (candyMachine.state.whitelistMintSettings) {
        const mint = new PublicKey(candyMachine.state.whitelistMintSettings.mint)
        const whitelistToken = (await getAtaForMint(mint, payer))[0]

        remainingAccounts.push({
            pubkey: whitelistToken,
            isWritable: true,
            isSigner: false,
        })

        if (candyMachine.state.whitelistMintSettings.mode.burnEveryTime) {
            const whitelistBurnAuthority = Keypair.generate()

            remainingAccounts.push({
                pubkey: mint,
                isWritable: true,
                isSigner: false,
            })
            remainingAccounts.push({
                pubkey: whitelistBurnAuthority.publicKey,
                isWritable: false,
                isSigner: true,
            })
            signers.push(whitelistBurnAuthority)
            const exists = await candyMachine.program.provider.connection.getAccountInfo(whitelistToken)

            if (exists) {
                instructions.push(Token.createApproveInstruction(TOKEN_PROGRAM_ID, whitelistToken, whitelistBurnAuthority.publicKey, payer, [], 1))
                cleanupInsructions.push(Token.createRevokeInstruction(TOKEN_PROGRAM_ID, whitelistToken, payer, []))
            }
        }
    }

    if (candyMachine.state.tokenMint) {
        const transferAuthority = Keypair.generate()

        signers.push(transferAuthority)
        remainingAccounts.push({
            pubkey: userPayingAccountAddress,
            isWritable: true,
            isSigner: false,
        })
        remainingAccounts.push({
            pubkey: transferAuthority.publicKey,
            isWritable: false,
            isSigner: true,
        })

        instructions.push(Token.createApproveInstruction(TOKEN_PROGRAM_ID, userPayingAccountAddress, transferAuthority.publicKey, payer, [], candyMachine.state.price))
        cleanupInsructions.push(Token.createRevokeInstruction(TOKEN_PROGRAM_ID, userPayingAccountAddress, payer, []))
    }

    const metadataAddress = await getMetadata(mint.publicKey)
    const masterEdition = await getMasterEdition(mint.publicKey)

    const [ candyMachineCreator, creatorBump ] = await getCandyMachineCreator(candyMachine.id)

    instructions.push(
        await candyMachine.program.instruction.mintNft(creatorBump, {
            accounts: {
                candyMachine: candyMachine.id,
                candyMachineCreator,
                payer: payer,
                wallet: candyMachine.state.treasury,
                mint: mint.publicKey,
                metadata: metadataAddress,
                masterEdition,
                mintAuthority: payer,
                updateAuthority: payer,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
                clock: SYSVAR_CLOCK_PUBKEY,
                recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
                instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
            },
            remainingAccounts: remainingAccounts.length > 0 ? remainingAccounts : undefined,
        })
    )

    try {
        return (await sendTransactions(candyMachine.program.provider.connection, candyMachine.program.provider.wallet, [ instructions, cleanupInsructions ], [ signers, [] ])).txs.map(
            (t) => t.txid
        )[0]
    } catch (error) {
        console.error(error)
        return null
    }
}

export const sendTransactions = async (
    connection: Connection,
    wallet: any,
    instructionSet: TransactionInstruction[][],
    signersSet: Keypair[][],
    sequenceType: SequenceType = SequenceType.Parallel,
    commitment: Commitment = 'singleGossip',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    successCallback: (txid: string, ind: number) => void = () => {},
    failCallback: (reason: string, ind: number) => boolean = () => false,
    block?: BlockhashAndFeeCalculator
): Promise<{ number: number; txs: { txid: string; slot: number }[] }> => {
    if (!wallet.publicKey) throw new Error('wallet not connected')

    const unsignedTxns: Transaction[] = []

    if (!block) {
        block = await connection.getRecentBlockhash(commitment)
    }

    for (let i = 0; i < instructionSet.length; i++) {
        const instructions = instructionSet[i]
        const signers = signersSet[i]

        if (instructions.length === 0) {
            continue
        }

        const transaction = new Transaction()
        instructions.forEach((instruction) => transaction.add(instruction))
        transaction.recentBlockhash = block.blockhash
        transaction.setSigners(
            // fee payed by the wallet owner
            wallet.publicKey,
            ...signers.map((s) => s.publicKey)
        )

        if (signers.length > 0) {
            transaction.partialSign(...signers)
        }

        unsignedTxns.push(transaction)
    }

    const signedTxns = await wallet.signAllTransactions(unsignedTxns)

    const pendingTxns: Promise<{ txid: string; slot: number }>[] = []

    const breakEarlyObject = { breakEarly: false, i: 0 }
    console.log('Signed txns length', signedTxns.length, 'vs handed in length', instructionSet.length)
    for (let i = 0; i < signedTxns.length; i++) {
        const signedTxnPromise = sendSignedTransaction({
            connection,
            signedTransaction: signedTxns[i],
        })

        signedTxnPromise
            .then(({ txid }) => {
                successCallback(txid, i)
            })
            .catch(() => {
                failCallback(signedTxns[i], i)
                if (sequenceType === SequenceType.StopOnFailure) {
                    breakEarlyObject.breakEarly = true
                    breakEarlyObject.i = i
                }
            })

        if (sequenceType !== SequenceType.Parallel) {
            try {
                await signedTxnPromise
            } catch (e) {
                console.log('Caught failure', e)
                if (breakEarlyObject.breakEarly) {
                    console.log('Died on ', breakEarlyObject.i)
                    // Return the txn we failed on by index
                    return {
                        number: breakEarlyObject.i,
                        txs: await Promise.all(pendingTxns),
                    }
                }
            }
        } else {
            pendingTxns.push(signedTxnPromise)
        }
    }

    if (sequenceType !== SequenceType.Parallel) {
        await Promise.all(pendingTxns)
    }

    return { number: signedTxns.length, txs: await Promise.all(pendingTxns) }
}

async function sendSignedTransaction({
    signedTransaction,
    connection,
    timeout = 15000,
}: {
    signedTransaction: Transaction
    connection: Connection
    sendingMessage?: string
    sentMessage?: string
    successMessage?: string
    timeout?: number
}): Promise<{ txid: string; slot: number }> {
    const rawTransaction = signedTransaction.serialize()
    const startTime = getUnixTs()
    let slot = 0
    const txid: TransactionSignature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
    })

    console.log('Started awaiting confirmation for', txid)

    let done = false
    ;(async () => {
        while (!done && getUnixTs() - startTime < timeout) {
            connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
            })
            await new Promise((resolve) => setTimeout(() => resolve(null), 500))
        }
    })()
    try {
        const confirmation = await awaitTransactionSignatureConfirmation(txid, timeout, connection, 'recent', true)

        if (!confirmation) throw new Error('Timed out awaiting confirmation on transaction')

        if (confirmation.err) {
            console.error(confirmation.err)
            throw new Error('Transaction failed: Custom instruction error')
        }

        slot = confirmation?.slot || 0
    } catch (err: any) {
        console.error('Timeout Error caught', err)
        if (err.timeout) {
            throw new Error('Timed out awaiting confirmation on transaction')
        }
        let simulateResult: SimulatedTransactionResponse | null = null
        try {
            simulateResult = (await simulateTransaction(connection, signedTransaction, 'single')).value
        } catch (e) {
            console.log(e)
        }
        if (simulateResult && simulateResult.err) {
            if (simulateResult.logs) {
                for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
                    const line = simulateResult.logs[i]
                    if (line.startsWith('Program log: ')) {
                        throw new Error('Transaction failed: ' + line.slice('Program log: '.length))
                    }
                }
            }
            throw new Error(JSON.stringify(simulateResult.err))
        }
        // throw new Error('Transaction failed');
    } finally {
        done = true
    }

    console.log('Latency', txid, getUnixTs() - startTime)
    return { txid, slot }
}

const getUnixTs = () => new Date().getTime() / 1000

function getAtaForMint(mint: PublicKey, payer: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress([ payer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer() ], SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID)
}

function createAssociatedTokenAccountInstruction(associatedTokenAddress: PublicKey, payer: PublicKey, walletAddress: PublicKey, splTokenMintAddress: PublicKey) {
    const keys = [
        {
            pubkey: payer,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: associatedTokenAddress,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: walletAddress,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: splTokenMintAddress,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ]
    return new TransactionInstruction({
        keys,
        programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        data: Buffer.from([]),
    })
}

async function getMetadata(mint: PublicKey): Promise<PublicKey> {
    return (await PublicKey.findProgramAddress([ Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer() ], TOKEN_METADATA_PROGRAM_ID))[0]
}

async function getMasterEdition(mint: PublicKey): Promise<PublicKey> {
    return (
        await PublicKey.findProgramAddress([ Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition') ], TOKEN_METADATA_PROGRAM_ID)
    )[0]
}

async function getCandyMachineCreator(candyMachine: PublicKey): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress([ Buffer.from('candy_machine'), candyMachine.toBuffer() ], CANDY_MACHINE_PROGRAM)
}

export const getCandyMachineState = async (wallet: AnchorWallet, id: PublicKey, connection: Connection): Promise<CandyMachine> => {
    const provider = new Provider(connection, wallet, { preflightCommitment: 'recent' })
    const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider)
    const program = new Program(idl!, CANDY_MACHINE_PROGRAM, provider)

    const { data, tokenMint, wallet: _wallet, endSettings, itemsRedeemed: _itemsRedeemed } = await program.account.candyMachine.fetch(id)

    const itemsAvailable = data.itemsAvailable.toNumber()
    const itemsRedeemed = _itemsRedeemed.toNumber()
    const itemsRemaining = itemsAvailable - itemsRedeemed

    const time = new Date().getTime() / 1000

    return {
        id,
        program,
        state: {
            itemsAvailable,
            itemsRedeemed,
            itemsRemaining,
            isSoldOut: itemsRemaining === 0,
            isActive:
                data.goLiveDate && data.goLiveDate.toNumber() < time && endSettings
                    ? endSettings.endSettingType.date
                        ? endSettings.number.toNumber() > time
                        : itemsRedeemed < endSettings.number.toNumber()
                    : true,
            goLiveDate: data.goLiveDate,
            treasury: _wallet,
            tokenMint: tokenMint,
            gatekeeper: data.gatekeeper,
            endSettings: data.endSettings,
            whitelistMintSettings: data.whitelistMintSettings,
            hiddenSettings: data.hiddenSettings,
            price: data.price.toNumber(),
        },
    }
}

export async function awaitTransactionSignatureConfirmation(
    txid: TransactionSignature,
    timeout: number,
    connection: Connection,
    commitment: Commitment = 'recent',
    queryStatus = false
): Promise<SignatureStatus | null | void> {
    let done = false
    let status: SignatureStatus | null | void = {
        slot: 0,
        confirmations: 0,
        err: null,
    }
    let subId = 0

    status = await new Promise(async (resolve, reject) => {
        setTimeout(() => {
            if (done) {
                return
            }
            done = true
            console.log('Rejecting for timeout...')
            reject({ timeout: true })
        }, timeout)
        try {
            subId = connection.onSignature(
                txid,
                (result, context) => {
                    done = true
                    status = {
                        err: result.err,
                        slot: context.slot,
                        confirmations: 0,
                    }
                    if (result.err) {
                        console.log('Rejected via websocket', result.err)
                        reject(status)
                    } else {
                        console.log('Resolved via websocket', result)
                        resolve(status)
                    }
                },
                commitment
            )
        } catch (e) {
            done = true
            console.error('WS error in setup', txid, e)
        }
        while (!done && queryStatus) {
            // eslint-disable-next-line no-loop-func
            ;(async () => {
                try {
                    const signatureStatuses = await connection.getSignatureStatuses([ txid ])
                    status = signatureStatuses && signatureStatuses.value[0]
                    if (!done) {
                        if (!status) {
                            console.log('REST null result for', txid, status)
                        } else if (status.err) {
                            console.log('REST error for', txid, status)
                            done = true
                            reject(status.err)
                        } else if (!status.confirmations) {
                            console.log('REST no confirmations for', txid, status)
                        } else {
                            console.log('REST confirmation for', txid, status)
                            done = true
                            resolve(status)
                        }
                    }
                } catch (e) {
                    if (!done) {
                        console.log('REST connection error: txid', txid, e)
                    }
                }
            })()
            await new Promise((resolve) => setTimeout(() => resolve(null), 2000))
        }
    })

    //@ts-ignore
    if (connection._signatureSubscriptions[subId]) connection.removeSignatureListener(subId)
    done = true
    console.log('Returning status', status)
    return status
}

async function simulateTransaction(connection: Connection, transaction: Transaction, commitment: Commitment): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
    // @ts-ignore
    transaction.recentBlockhash = await connection._recentBlockhash(
        // @ts-ignore
        connection._disableBlockhashCaching
    )

    const signData = transaction.serializeMessage()
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData)
    const encodedTransaction = wireTransaction.toString('base64')
    const config: any = { encoding: 'base64', commitment }
    const args = [ encodedTransaction, config ]

    // @ts-ignore
    const res = await connection._rpcRequest('simulateTransaction', args)
    if (res.error) {
        throw new Error('failed to simulate transaction: ' + res.error.message)
    }
    return res.result
}

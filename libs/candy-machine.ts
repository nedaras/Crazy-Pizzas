import { Program, Provider } from '@project-serum/anchor'
import { Wallet } from '@project-serum/anchor/dist/cjs/provider'
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Adapter } from '@solana/wallet-adapter-base/lib/esm/types'
import {
    Connection,
    Keypair,
    PublicKey,
    SignatureStatus,
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
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

const getTransactions = async (candyMachine: CandyMachine, payer: PublicKey): Promise<[Connection, Wallet, TransactionInstruction[][], Keypair]> => {
    const mint = Keypair.generate()

    const userTokenAccountAddress = await getAtaForMint(mint.publicKey, payer)

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

    const metadataAddress = await getMetadata(mint.publicKey)
    const masterEdition = await getMasterEdition(mint.publicKey)

    const [ candyMachineCreator, creatorBump ] = await getCandyMachineCreator(candyMachine.id)

    instructions.push(
        await candyMachine.program.instruction.mintNft(creatorBump, {
            accounts: {
                candyMachine: candyMachine.id,
                candyMachineCreator,
                payer,
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
        })
    )

    return [ candyMachine.program.provider.connection, candyMachine.program.provider.wallet, [ instructions ], mint ]
}

export async function signTransactions(candyMachine: CandyMachine, payer: PublicKey): Promise<[string, null] | [null, [Connection, Transaction]]> {
    const [ connection, wallet, instructionSet, signer ] = await getTransactions(candyMachine, payer)

    const unsignedTxns: Transaction[] = []
    const block = await connection.getRecentBlockhash('singleGossip')

    for (const instructions of instructionSet) {
        const transaction = new Transaction({ feePayer: wallet.publicKey })
        instructions.forEach((instruction) => transaction.add(instruction))
        transaction.recentBlockhash = block.blockhash
        transaction.partialSign(signer)

        unsignedTxns.push(transaction)
    }

    const signedTxns = await wallet.signAllTransactions(unsignedTxns).catch((err: Error) => err.message)

    if (typeof signedTxns == 'string') return [ signedTxns, null ]
    return [ null, [ connection, signedTxns[0] ] ]
}

export const sendTransactions = (connection: Connection, transaction: Transaction) =>
    new Promise(async (resolve, reject) => {
        try {
            const signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
            const confirmation = await getTransactionSignatureConfirmation(signature, connection)

            confirmation.err ? reject(confirmation.err) : resolve(null)
        } catch (error: any) {
            reject(error)
        }
    })

async function getAtaForMint(mint: PublicKey, payer: PublicKey): Promise<PublicKey> {
    return (await PublicKey.findProgramAddress([ payer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer() ], SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID))[0]
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

export const getCandyMachine = async (wallet: Adapter | PublicKey, id: PublicKey, connection: Connection): Promise<CandyMachine> => {
    const provider = new Provider(connection, wallet as any, { preflightCommitment: 'recent' })
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

function getTransactionSignatureConfirmation(signature: TransactionSignature, connection: Connection): Promise<SignatureStatus> {
    return new Promise((resolve, reject) => {
        try {
            connection.onSignature(
                signature,
                ({ err }, { slot }) => {
                    console.log('viskas normaliai')

                    if (err) {
                        console.error('Rejected via websocket', err)
                        return resolve({ err: 'rejected via websocket', slot, confirmations: 0 })
                    }
                    resolve({ err, slot, confirmations: 0 })
                },
                'recent'
            )
        } catch (error) {
            console.error('WS error in setup', signature, error)
            reject('websockets failed to initialize')
        }
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

import { Program, Provider } from '@project-serum/anchor'
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { Connection, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js'
import { CandyMachine } from '../@types/candy-machine'

export const CANDY_MACHINE_PROGRAM = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ')

export const mint = async (candyMachine: CandyMachine, payer: PublicKey) => {
    // Promise<(string | undefined)[]>

    const mint = Keypair.generate()

    const userTokenAccountAddress = (await getAtaForMint(mint.publicKey, payer))[0]
    const userPayingAccountAddress = candyMachine.state.tokenMint ? (await getAtaForMint(candyMachine.state.tokenMint, payer))[0] : payer

    const remainingAccounts = []
    const signer = [ mint ]
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
}

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
async function getAtaForMint(mint: PublicKey, payer: PublicKey): Promise<[PublicKey, number]> {
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

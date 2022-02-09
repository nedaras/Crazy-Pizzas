import { web3 } from '@project-serum/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import type { NextPage } from 'next'
import { useCandyMachine } from '../hooks/useCandyMachine'
import { awaitTransactionSignatureConfirmation, getCandyMachineState, mint } from '../libs/candy-machine'

// TODO: make this fields usable with web3 privider, context
const connection = new web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)
const candyMachineId = new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE!)

const Home: NextPage = () => {

    const wallet = useAnchorWallet()
    const [ candyMachine, updateCandyMachine ] = useCandyMachine()

    async function mintNFT() {

        // TODO: if wallet is undefined make a request for it
        if (wallet) {

            const candyMachine = await getCandyMachineState(wallet, candyMachineId, connection)
            const id = await mint(candyMachine, wallet.publicKey)
            const status = id ? await awaitTransactionSignatureConfirmation(id, 15000, connection, 'singleGossip', true) : null

            !status?.err && console.log('success')

            updateCandyMachine()

        }

    }

    return candyMachine ? (
        <>
            <p>Total Available {candyMachine.available}</p>
            <p>Reddemed {candyMachine.reddemed}</p>
            <p>Remaining {candyMachine.remaining}</p>
            <button onClick={() => mintNFT()} >Mint</button>
        </>
    ) : null
}

export default Home

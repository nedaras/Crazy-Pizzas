import { useAnchorWallet } from '@solana/wallet-adapter-react'
import type { NextPage } from 'next'
import { useCandyMachine } from '../hooks/useCandyMachine'
import { useWeb3 } from '../hooks/useWeb3'
import { awaitTransactionSignatureConfirmation, getCandyMachineState, mint } from '../libs/candy-machine'

const Home: NextPage = () => {
    const wallet = useAnchorWallet()

    const [ candyMachineId, connection ] = useWeb3()
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

    return (
        <>
            <p>Total Available {candyMachine.available}</p>
            <p>Reddemed {candyMachine.reddemed}</p>
            <p>Remaining {candyMachine.remaining}</p>
            <button onClick={() => mintNFT()}>Mint</button>
        </>
    )
}

export default Home

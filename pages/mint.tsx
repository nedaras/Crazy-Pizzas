import type { NextPage } from 'next'
import { useCandyMachine } from '../hooks/useCandyMachine'
import { useWallet } from '../hooks/useWallet'
import { useWeb3 } from '../hooks/useWeb3'
import { getTransactionSignatureConfirmation, getCandyMachine, mint } from '../libs/candy-machine'

const Home: NextPage = () => {
    const [ candyMachineId, connection ] = useWeb3()
    const [ candyMachine, updateCandyMachine ] = useCandyMachine()

    const [ web3Wallte, connect ] = useWallet()

    async function mintNFT() {
        const wallet = web3Wallte && web3Wallte.publicKey ?  web3Wallte : await connect()

        console.log(wallet)

        if (wallet && wallet.publicKey) {
            const candyMachine = await getCandyMachine(wallet, candyMachineId, connection)
            const id = await mint(candyMachine, wallet.publicKey)
            const status = id ? await getTransactionSignatureConfirmation(id, 15000, connection, 'singleGossip', true) : null

            if (status && !status.err) {
                console.log('success')
                updateCandyMachine()
            } else {
                status && console.log(status?.err)
            }
        }
    }

    return (
        <>
            <p>Total Available {candyMachine.available}</p>
            <p>Reddemed {candyMachine.reddemed}</p>
            <p>Remaining {candyMachine.remaining}</p>
            <p>Price {candyMachine.price} SOL</p>
            <button onClick={() => mintNFT()}>Mint</button>
        </>
    )
}

export default Home

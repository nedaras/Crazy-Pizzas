import type { NextPage } from 'next'
import { useCandyMachine } from '../hooks/useCandyMachine'
import { useWallet } from '../hooks/useWallet'
import { useWeb3 } from '../hooks/useWeb3'
// TODO: make code cleaner, faster and FUCKING READABLE :)
import { getTransactionSignatureConfirmation, getCandyMachine, mint } from '../libs/candy-machine'

const Home: NextPage = () => {
    const [ candyMachineId, connection ] = useWeb3()
    const [ candyMachine, updateCandyMachine ] = useCandyMachine()
    // TODO: make wallet variable in useWallet grabed from Web3Provider
    const [ web3Wallte, connect ] = useWallet()

    async function mintNFT() {
        const wallet = web3Wallte || (await connect())

        if (wallet && wallet.publicKey) {
            const candyMachine = await getCandyMachine(wallet, candyMachineId, connection)
            const id = await mint(candyMachine, wallet.publicKey)
            const status = id ? await getTransactionSignatureConfirmation(id, 15000, connection, 'singleGossip', true) : null

            if (!status?.err) {
                console.log('success')
                updateCandyMachine()
            } else {
                console.log(status.err)
            }
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

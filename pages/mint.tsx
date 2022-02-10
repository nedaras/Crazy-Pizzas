import type { NextPage } from 'next'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useCandyMachine } from '../hooks/useCandyMachine'
import { useWallet } from '../hooks/useWallet'
import { useWeb3 } from '../hooks/useWeb3'
import { getTransactionSignatureConfirmation, getCandyMachine, mint } from '../libs/candy-machine'

const Home: NextPage = () => {
    const [ candyMachineId, connection ] = useWeb3()
    const [ candyMachine, updateCandyMachine ] = useCandyMachine()
    const [ minting, setMinting ] = useState(false)

    const [ , connect ] = useWallet()
    
    async function mintNFT() {

        if (minting) return;

        setMinting(true)

        const wallet = await connect()

        if (wallet) {
            
            const candyMachine = await getCandyMachine(wallet, candyMachineId, connection)
            const [ id, error ] = await mint(candyMachine, wallet.publicKey!)

            if (!error) {
                
                const status = await getTransactionSignatureConfirmation(id!, 15000, connection, 'singleGossip', true)
                
                if (status && !status.err) {
                    updateCandyMachine()
                    toast.success('Your Pizza was minted.')
                } else {
                    toast.error('Some weird error has occurred!')

                }

            } else {

                const errorMessage = error == 'User rejected the request.' ? 'You have cancelled a transaction.' : 'Some weird error has occurred!'
                toast.error(errorMessage)

            }

        }

        setMinting(false)

    }

    return (
        <>
            <Toaster position='bottom-center' reverseOrder={false} />

            <p>Total Available {candyMachine.available}</p>
            <p>Reddemed {candyMachine.reddemed}</p>
            <p>Remaining {candyMachine.remaining}</p>
            <p>Price {candyMachine.price} SOL</p>
            <button onClick={() => mintNFT()}>{ minting ? 'Minting...' : candyMachine.remaining == 0 ? 'Sold out' : 'Mint' }</button>
        </>
    )
}

export default Home

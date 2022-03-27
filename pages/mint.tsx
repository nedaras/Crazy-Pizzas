import type { NextPage } from 'next'
import { FC, MouseEventHandler, useState } from 'react'
import { Button } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast'
import Header from '../components/Header'
import { useCandyMachine } from '../hooks/useCandyMachine'
import { useWallet } from '../hooks/useWallet'
import { useWeb3 } from '../hooks/useWeb3'
import { getCandyMachine, sendTransactions, signTransactions } from '../libs/candy-machine'

interface MintButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>
    minting: boolean
    soledOut: boolean
}

const Home: NextPage = () => {
    const [ candyMachineId, connection ] = useWeb3()
    const [ candyMachine, updateCandyMachine ] = useCandyMachine()
    const [ minting, setMinting ] = useState(false)

    const connect = useWallet()

    async function mintNFT() {
        if (minting) return

        const wallet = await connect()

        if (wallet) {
            const candyMachine = await getCandyMachine(wallet, candyMachineId, connection)
            const [ cancelled, transaction ] = await signTransactions(candyMachine, wallet.publicKey!)

            if (!cancelled) {
                setMinting(true)

                const promise = sendTransactions(...transaction!)
                    .then(() => updateCandyMachine())
                    .catch(() => {
                        setMinting(false)
                        throw ''
                    })

                toast.promise(promise, {
                    loading: 'Minting your Pizza.',
                    success: 'Your Pizza was minted.',
                    error: 'Unknown error has occurred',
                })
            } else toast.error('You have cancelled a transaction.')
        }
    }

    return (
        <>
            <Toaster position="bottom-center" reverseOrder={false} />

            <Header />

            <p>Total Available {candyMachine.available}</p>
            <p>Redeemed {candyMachine.redeemed}</p>
            <p>Remaining {candyMachine.remaining}</p>
            <p>Price {candyMachine.price} SOL</p>
            <MintButton onClick={mintNFT} minting={minting} soledOut={candyMachine.remaining === 0} />
        </>
    )
}

const MintButton: FC<MintButtonProps> = ({ onClick, minting, soledOut }) => (
    <Button onClick={onClick} disabled={soledOut || minting}>
        {soledOut ? 'Soled Out' : minting ? 'Minting your Pizza...' : 'Mint a Pizza'}
    </Button>
)

export default Home

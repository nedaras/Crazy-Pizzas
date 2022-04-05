import type { GetServerSideProps, NextPage } from 'next'
import { FC, MouseEventHandler, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast'
import { CandyMachineState } from '../@types/candy-machine'

import { useWallet } from '../hooks/useWallet'
import { useWeb3 } from '../hooks/useWeb3'
import { getData } from '../libs/fetch-data'
import { Adapter } from '@solana/wallet-adapter-base/lib/types'
import dynamic from 'next/dynamic'
import Mint from '../components/Mint'

const WalletAdapter = dynamic(() => import('../components/WalletAdapter'))

interface Props {
    remaining: number
    available: number
    redeemed: number
    price: number
}

interface MintButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>
    minting: boolean
    soledOut: boolean
}

const Home: NextPage<Props> = ({ remaining, available, redeemed, price }) => {
    const [ getWallet, detected ] = useWallet()
    const [ selectedWallet, setSelectedWallet ] = useState<string | null>(detected.length == 1 ? detected[0].name : null)

    const [ showWalletAdapter, setShowWalletAdapter ] = useState(false)

    const [ itemsRemaining, setItemsRemaining ] = useState(remaining)
    const [ itemsRedeemed, setItemsRedeemed ] = useState(redeemed)

    const [ candyMachineId, connection ] = useWeb3()
    const [ minting, setMinting ] = useState(false)

    function handleSelect(wallet: Adapter) {
        setSelectedWallet(wallet.name)
        setShowWalletAdapter(false)

        mintNFT()
    }

    async function mintNFT() {
        if (minting) return

        if (detected.length > 0) {
            const wallet = selectedWallet ? await getWallet(selectedWallet) : null

            if (wallet) {
                const { getCandyMachine, sendTransactions, signTransactions } = await import('../libs/candy-machine')
                const candyMachine = await getCandyMachine(wallet, candyMachineId, connection)

                const [ cancelled, transaction ] = await signTransactions(candyMachine, wallet.publicKey!)

                if (!cancelled) {
                    setMinting(true)

                    const promise = sendTransactions(...transaction!)
                        .then(() => {
                            setItemsRedeemed(itemsRedeemed + 1)
                            setItemsRemaining(itemsRemaining - 1)
                            setMinting(false)
                        })
                        .catch(() => {
                            setMinting(false)
                            throw ''
                        })

                    return toast.promise(promise, {
                        loading: 'Minting your Pizza.',
                        success: 'Your Pizza was minted.',
                        error: 'Unknown error has occurred',
                    })
                }
            }

            if (selectedWallet) return toast.error('You have cancelled a transaction.')
        }

        setShowWalletAdapter(true)
    }

    return (
        <>
            <Toaster position="bottom-center" reverseOrder={false} />
            <WalletAdapter select={detected.length > 0} show={showWalletAdapter} onClose={() => setShowWalletAdapter(false)} onSelect={handleSelect} />

            <Container className="mw-xl">
                <Mint remaining={itemsRemaining} available={available} button={<MintButton onClick={mintNFT} minting={minting} soledOut={itemsRemaining === 0} />} >
                <p>Total Available {available}</p>
                <p>Redeemed {itemsRedeemed}</p>
                <p>Remaining {itemsRemaining}</p>
                <p>Price {price} SOL</p>
                </Mint>
            </Container>
        </>
    )
}

const MintButton: FC<MintButtonProps> = ({ onClick, minting, soledOut }) => {
    return (
        <Button className="w-75 px-5 mt-3 text-light" variant="info" size="lg" onClick={onClick} disabled={soledOut || minting} >
            {soledOut ? 'Soled Out' : minting ? 'Minting your Pizza...' : 'Mint a Pizza'}
        </Button>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const candyMachine = (await getData<CandyMachineState>(`http://${req.headers.host}/api/candy-machine/getState`)) as CandyMachineState

    return {
        props: {
            remaining: candyMachine.itemsRemaining,
            available: candyMachine.itemsAvailable,
            redeemed: candyMachine.itemsRedeemed,
            price: candyMachine.price,
        },
    }
}

export default Home

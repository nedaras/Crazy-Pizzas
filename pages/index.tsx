import type { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import type { Adapter } from '@solana/wallet-adapter-base/lib/types'

import n15 from '../public/nfts/json/15.json'
import n7 from '../public/nfts/json/7.json'
import n58 from '../public/nfts/json/58.json'
import type { CandyMachineState } from '../@types/candy-machine'
import { getData } from '../libs/fetch-data'

import Mint from '../components/Mint'
import { useWallet } from '../hooks/useWallet'
import { useWeb3 } from '../hooks/useWeb3'
import dynamic from 'next/dynamic'

import nft7 from '../public/nfts/images/7.png'
import nft15 from '../public/nfts/images/15.png'
import nft58 from '../public/nfts/images/58.png'
import NFTCard from '../components/NFTCard'
import Content, { Field } from '../components/Content'

const WalletAdapter = dynamic(() => import('../components/WalletAdapter'))

// @ts-ignore
const Toaster = dynamic(() => import('react-hot-toast').then((mod) => mod.Toaster))

// https://lottiefiles.com/98350-fireworks

interface Props {
    remaining: number
    available: number
    redeemed: number
    price: number
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
            const toast = import('react-hot-toast').then((mod) => mod.default)
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

                    return (await toast).promise(promise, {
                        loading: 'Minting your Pizza.',
                        success: 'Your Pizza was minted.',
                        error: 'Unknown error has occurred',
                    })
                }
            }

            if (selectedWallet) return (await toast).error('You have cancelled a transaction.')
        }

        setShowWalletAdapter(true)
    }

    return (
        <>
            <Toaster position="bottom-center" reverseOrder={false} />
            <WalletAdapter select={detected.length > 0} show={showWalletAdapter} onClose={() => setShowWalletAdapter(false)} onSelect={handleSelect} />
            <Container className="mw-xl mb-5">
                <Mint remaining={remaining} available={available} onClick={mintNFT} price={price} minting={minting} />
                <hr className="mb-5" />
                <Content>
                    <Field title="About The Pizzas">
                        <li>
                            One pizzas price is <strong>0.8 SOL</strong>.
                        </li>
                        <li>
                            First <strong>222</strong> to mint get Pizza for <strong>Free</strong>.
                        </li>
                    </Field>
                    <Field title="Notice">
                        <li>
                            One pizzas price is <strong>0.8 SOL</strong>.
                        </li>
                        <li>
                            First <strong>222</strong> to mint get Pizza for <strong>Free</strong>.
                        </li>
                    </Field>
                    <Field title="Something">
                        <li>
                            One pizzas price is <strong>0.8 SOL</strong>.
                        </li>
                        <li>
                            First <strong>222</strong> to mint get Pizza for <strong>Free</strong>.
                        </li>
                    </Field>
                    <Field title="Whats Next?">
                        <li>
                            One pizzas price is <strong>0.8 SOL</strong>.
                        </li>
                        <li>
                            First <strong>222</strong> to mint get Pizza for <strong>Free</strong>.
                        </li>
                    </Field>
                </Content>
                <hr className="my-5" />
                <Row className="justify-content-center g-3" xs="auto" md={{ cols: 2 }} lg={{ cols: 3 }}>
                    <NFTCard img={nft7} layers={n15} />
                    <NFTCard img={nft15} layers={n7} />
                    <NFTCard img={nft58} layers={n58} />
                </Row>
            </Container>
        </>
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

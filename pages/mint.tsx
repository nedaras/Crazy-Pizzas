import { web3 } from '@project-serum/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { CandyMachineState } from '../@types/candy-machine'
import { getCandyMachineState } from '../libs/candy-machine'

// TODO: make this fields usable with web3 privider, context
const connection = new web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)
const id = new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE!)

const Home: NextPage = () => {
    const wallet = useAnchorWallet()
    const [ collection, setCollection ] = useState<CandyMachineState | null>(null)

    useEffect(() => {
        ;(async () => {
            if (!wallet) return

            const { state } = await getCandyMachineState(wallet, id, connection)
            setCollection(state)
        })()
    }, [ wallet, connection, id ])

    return collection ? (
        <>
            <p>Total Available {collection.itemsAvailable}</p>
            <p>Reddemed {collection.itemsRedeemed}</p>
            <p>Remaining {collection.itemsRemaining}</p>
            <button>Mint</button>
        </>
    ) : null
}

export default Home

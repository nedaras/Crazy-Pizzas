import { web3 } from '@project-serum/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { CandyMachine } from '../@types/candy-machine'
import { getCandyMachineState, mint } from '../libs/candy-machine'

// TODO: make this fields usable with web3 privider, context
const connection = new web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)
const id = new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE!)

const Home: NextPage = () => {
    const wallet = useAnchorWallet()
    const [ candyMachine, setCandyMachine ] = useState<CandyMachine | null>(null)

    useEffect(() => {
        ;(async () => {
            if (!wallet) return

            const candyMachine = await getCandyMachineState(wallet as any, id, connection)
            setCandyMachine(candyMachine)
        })()
    }, [ wallet, connection, id ])

    const onMint = async () => {
        if (wallet && candyMachine?.program && wallet.publicKey) {
            const mintTxId = (await mint(candyMachine, wallet.publicKey))[0]
            console.log(mintTxId)
            

        }
    }

    return candyMachine ? (
        <>
            <p>Total Available {candyMachine.state.itemsAvailable}</p>
            <p>Reddemed {candyMachine.state.itemsRedeemed}</p>
            <p>Remaining {candyMachine.state.itemsRemaining}</p>
            <button onClick={() => onMint()} >Mint</button>
        </>
    ) : null
}

export default Home

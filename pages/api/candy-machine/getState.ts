import { web3 } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { NextApiRequest, NextApiResponse } from 'next'
import { ErrorResponse } from '../../../@types'
import { CandyMachine, CandyMachineState } from '../../../@types/candy-machine'
import { getCandyMachine } from '../../../libs/candy-machine'

const connection = new web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)
const candyMachineId = new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE!)
const wallet = new PublicKey(process.env.WALLET!)

export default async function handler(request: NextApiRequest, response: NextApiResponse<CandyMachineState | ErrorResponse>) {
    if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })

    const candyMachine = await getCandyMachine(wallet, candyMachineId, connection).catch((error) => {
        console.error(error)
        return { error: error.message }
    })

    response.status(isResponseAnError(candyMachine) ? 500 : 200).json((candyMachine as CandyMachine).state || candyMachine)
}

const isResponseAnError = (response: any): response is ErrorResponse => response.error !== undefined

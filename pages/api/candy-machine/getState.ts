import { web3 } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { NextApiRequest, NextApiResponse } from 'next'
import { ErrorResponse } from '../../../@types'
import { CandyMachineState } from '../../../@types/candy-machine'
import { getCandyMachine } from '../../../libs/candy-machine'

const connection = new web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)
const candyMachineId = new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE!)
const wallet = new PublicKey(process.env.WALLET!)

export default async function handler(request: NextApiRequest, response: NextApiResponse<CandyMachineState | ErrorResponse>) {
    if (request.method?.toUpperCase() !== 'GET') return response.status(404).json({ status: 400, message: 'only accepts "GET" requests' })

    const { state } = await getCandyMachine(wallet, candyMachineId, connection).catch(() => ({
        state: {
            status: 500,
            message: 'uncaught error',
        },
    }))

    response.json(state)
}

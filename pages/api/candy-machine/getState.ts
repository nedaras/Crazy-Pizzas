import { PublicKey } from '@solana/web3.js'
import { NextApiRequest, NextApiResponse } from 'next'
import { ErrorResponse } from '../../../@types'
import { CandyMachineState } from '../../../@types/candy-machine'
import { useWeb3 } from '../../../hooks/useWeb3'
import { getCandyMachineState } from '../../../libs/candy-machine'

const wallet = new PublicKey(process.env.WALLET!)

export default async function handler(request: NextApiRequest, response: NextApiResponse<CandyMachineState | ErrorResponse>) {
    if (request.method?.toUpperCase() !== 'GET') return response.status(404).json({ status: 400, message: 'only accpets "POST" requests' })

    const { state } = await getCandyMachineState(wallet as any, ...useWeb3()).catch(() => ({
        state: {
            status: 500,
            message: 'uncaught error',
        },
    }))

    response.json(state)
}

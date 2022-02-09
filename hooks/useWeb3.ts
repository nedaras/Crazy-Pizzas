import { Connection, PublicKey } from '@solana/web3.js'
import { web3 } from '@project-serum/anchor'
import { useMemo } from 'react'

const connection = new web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)
const candyMachineId = new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE!)

export const useWeb3 = (): [PublicKey, Connection] => useMemo(() => [ candyMachineId, connection ], [])
import { PublicKey, BN } from '@solana/web3.js'
import { Program } from '@project-serum/anchor'

interface CandyMachineState {
    itemsAvailable: number
    itemsRedeemed: number
    itemsRemaining: number
    treasury: PublicKey
    tokenMint: PublicKey
    isSoldOut: boolean
    isActive: boolean
    goLiveDate: number
    price: BN
    gatekeeper: null | {
        expireOnUse: boolean
        gatekeeperNetwork: PublicKey
    }
    endSettings: null | [number, BN]
    whitelistMintSettings: null | {
        mode: any
        mint: PublicKey
        presale: boolean
        discountPrice: null | BN
    }
    hiddenSettings: null | {
        name: string
        uri: string
        hash: Uint8Array
    }
}

export interface CandyMachine {
    id: PublicKey
    program: Program
    state: CandyMachineState
}

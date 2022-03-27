import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { ErrorResponse } from '../@types'
import { CandyMachineState } from '../@types/candy-machine'
import { getData, isResponseAnError } from '../libs/fetch-data'

interface CandyMachine {
    available: number | undefined
    redeemed: number | undefined
    remaining: number | undefined
    price: number | undefined
}
// TODO: use mint machine object not useStates it will be more dev friendly and more fast
export const useCandyMachine = (): [CandyMachine, () => void] => {
    const [ available, setAvailable ] = useState<number>()
    const [ redeemed, setRedeemed ] = useState<number>()
    const [ remaining, setRemaining ] = useState<number>()
    const [ price, setPrice ] = useState<number>()

    async function getCandyMachine(): Promise<[CandyMachineState, null] | [null, ErrorResponse]> {
        const response = await getData<CandyMachineState>(`${window.location.origin}/api/candy-machine/getState`)
        if (isResponseAnError(response)) return [ null, response ]
        return [ response, null ]
    }

    async function updateCandyMachine() {
        const [ candyMachine, error ] = await getCandyMachine()
        if (error) return console.error(error)

        setAvailable(candyMachine?.itemsAvailable)
        setRedeemed(candyMachine?.itemsRedeemed)
        setRemaining(candyMachine?.itemsRemaining)
        setPrice(candyMachine?.price / LAMPORTS_PER_SOL)
    }

    async function fakeUpdate() {
        if (redeemed == null || remaining == null) {
            updateCandyMachine()
            return
        }

        setRedeemed(redeemed + 1)
        setRemaining(remaining - 1)
    }

    useEffect(() => {
        updateCandyMachine()
    }, [])

    return [ { available, redeemed, remaining, price }, fakeUpdate ]
}

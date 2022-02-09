import { useEffect, useState } from 'react'
import { ErrorResponse } from '../@types'
import { CandyMachineState } from '../@types/candy-machine'
import { getData, isResponseAnError } from '../libs/fetch-data'

interface CandyMachine {
    available: number | undefined
    reddemed: number | undefined
    remaining: number | undefined
}

export const useCandyMachine = (): [CandyMachine | null, () => void] => {
    const [ available, setAvailable ] = useState<number>()
    const [ reddemed, setReddemed ] = useState<number>()
    const [ remaining, setRemaining ] = useState<number>()

    async function getCandyMachine(): Promise<[CandyMachineState, null] | [null, ErrorResponse]> {
        const response = await getData<CandyMachineState | ErrorResponse>('http://localhost:3000/api/candy-machine/getState')
        if (isResponseAnError(response)) return [ null, response ]
        return [ response, null ]
    }

    async function updateCandyMachine() {
        const [ candyMachine, error ] = await getCandyMachine()
        if (error) return console.error(error)

        setAvailable(candyMachine?.itemsAvailable)
        setReddemed(candyMachine?.itemsRedeemed)
        setRemaining(candyMachine?.itemsRemaining)
    }

    async function fakeUpdate() {
        if (reddemed == null || remaining == null) {
            updateCandyMachine()
            return
        }

        setReddemed(reddemed + 1)
        setRemaining(remaining - 1)
    }

    useEffect(() => {
        updateCandyMachine()
    }, [])

    return [ { available, reddemed, remaining }, fakeUpdate ]
}

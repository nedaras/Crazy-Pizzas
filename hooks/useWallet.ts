import { useCallback, useContext, useState } from 'react'
import { Adapter } from '@solana/wallet-adapter-base/lib/types'
import { WalletContext } from '@solana/wallet-adapter-react'

export const useWallet = (): [ () => Promise<Adapter | null>, (wallet: Adapter) => void, number ] => {

    const getAdapter = useCallback(() => {

        for (const wallet of wallets) if (wallet.readyState == 'Installed') return wallet.adapter
        return null

    }, [])

    const wallets = useContext(WalletContext).wallets
    const [ wallet, setWallet ] = useState(getAdapter())

    async function connect() {
        const adapter = getAdapter()
        if (wallet && wallet.publicKey) return wallet
        if (!adapter) return null

        try {
            await adapter.connect()
            adapter.connected && setWallet(adapter)
            return adapter
        } catch (error) {
            console.log(error)
            return null
        }
    }

    return [ connect, setWallet, 1 ]
}

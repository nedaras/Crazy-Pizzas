import { getWalletAdapters } from '@solana/wallet-adapter-wallets'
import { useMemo, useState } from 'react'
import { Adapter } from '@solana/wallet-adapter-base/lib/esm/types'

export const useWallet = (): [Adapter | null, () => Promise<Adapter | null>] => {
    const wallets = useMemo(() => getWalletAdapters({ network: process.env.NEXT_PUBLIC_SOLANA_NETWORK as any }), [])
    const [ wallet, setWallet ] = useState(getAdapter())

    function getAdapter(): Adapter | null {
        for (const wallet of wallets) if (wallet.readyState == 'Installed') return wallet
        return null
    }

    async function connect() {
        const adapter = getAdapter()
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

    return [ wallet, connect ]
}

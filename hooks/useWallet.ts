import { useContext, useMemo, useState } from 'react'
import { Adapter } from '@solana/wallet-adapter-base/lib/types'
import { WalletContext } from '@solana/wallet-adapter-react'

export const useWallet = (): [(wallet: string) => Promise<Adapter | null>, Adapter[]] => {
    const wallets = useContext(WalletContext).wallets

    const registeredAdapters = useMemo(() => {
        const adapters = []
        for (const wallet of wallets) if (wallet.readyState == 'Installed') adapters.push(wallet.adapter)
        return adapters
    }, [ wallets ])

    const adapters = useMemo(() => {
        const adapters = new Map<string, Adapter>()

        for (const { adapter } of wallets) adapters.set(adapter.name, adapter)

        return adapters
    }, [ wallets ])

    const [ adapter, setAdapter ] = useState<Adapter | null>(null)

    async function getWallet(wallet: string) {
        const walletAdapter = adapters.get(wallet)
        if (!walletAdapter) throw new Error(`Wallet with name ${wallet} doesn't exist`)
        if (adapter == walletAdapter && walletAdapter.publicKey) return walletAdapter

        try {
            await walletAdapter.connect()
            walletAdapter.connected && setAdapter(walletAdapter)
            return walletAdapter
        } catch (error) {
            console.log(error)
            return null
        }
    }

    return [ getWallet, registeredAdapters ]
}

import { useContext, useState } from 'react'
import { Adapter } from '@solana/wallet-adapter-base/lib/esm/types'
import { WalletContext } from '@solana/wallet-adapter-react'

export const useWallet = (): [Adapter | null, () => Promise<Adapter | null>] => {
    const wallets = useContext(WalletContext).wallets
    const [ wallet, setWallet ] = useState(getAdapter())

    function getAdapter(): Adapter | null {
        for (const wallet of wallets) {
            //console.log(wallet);

            if (wallet.readyState == 'Installed') return wallet.adapter
        }
        return null
    }

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

    return [ wallet, connect ]
}

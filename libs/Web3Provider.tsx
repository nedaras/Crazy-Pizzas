import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { getWalletAdapters } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { FC, useMemo } from 'react'

const Web3Provider: FC = ({ children }) => {
    const endpoint = useMemo(() => clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NETWORK as any), [])
    const wallets = useMemo(() => getWalletAdapters({ network: process.env.NEXT_PUBLIC_SOLANA_NETWORK as any }), [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default Web3Provider

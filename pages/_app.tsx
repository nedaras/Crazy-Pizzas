import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Web3Provider from '../libs/Web3Provider'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Web3Provider>
            <Component {...pageProps} />
        </Web3Provider>
    )
}

export default MyApp

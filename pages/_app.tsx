import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Web3Provider from '../libs/Web3Provider'
import SSRProvider from 'react-bootstrap/SSRProvider'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Web3Provider>
            <SSRProvider>
                <div className="bg-white wrapper">
                    <Component {...pageProps} />
                </div>
            </SSRProvider>
        </Web3Provider>
    )
}

export default MyApp

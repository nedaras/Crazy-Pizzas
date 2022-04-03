import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Web3Provider from '../libs/Web3Provider'
import SSRProvider from 'react-bootstrap/SSRProvider'
import Header from '../components/Header'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Web3Provider>
            <SSRProvider>
                <div className="bg-white">
                    <Header />
                    <Component {...pageProps} />
                    <Footer />
                </div>
            </SSRProvider>
        </Web3Provider>
    )
}

export default MyApp

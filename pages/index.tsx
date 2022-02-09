import type { NextPage } from 'next'
import Header from '../components/Header'

const Home: NextPage = () => {

    return (
        <>
            <Header />
            <div>
                <h1 className="bg-danger">
                    Welcome to <br /> Crazy Pizzas
                </h1>
            </div>
        </>
    )
}

export default Home

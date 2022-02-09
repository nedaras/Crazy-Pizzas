import type { NextPage } from 'next'
import Header from '../components/Header'
import 'bootstrap/dist/css/bootstrap.css'

//import styles from '../styles/Home.module.scss'


const Home: NextPage = () => {
    return (
        <>
            <Header />
            <div>
                <h1 className='text-danger'>
                    Welcome to <br /> Crazy Pizzas
                </h1>
            </div>
        </>
    )
}

export default Home

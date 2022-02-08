import type { NextPage } from 'next'
import Header from '../components/Header'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {

    return <>
        <Header />
        <div className={styles['main-content']} >
            <h1>Welcome to <br /> Crazy Pizzas</h1>

        </div>

    </>

}

export default Home

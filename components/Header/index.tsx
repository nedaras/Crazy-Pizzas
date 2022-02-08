import { FC } from 'react'
import styles from '../../styles/Header.module.scss'
import Icons from './Icons'
import Routs from './Routs'

const Header: FC = () => {
    return (
        <div className={styles.header}>
            <Routs />
            <Icons />
        </div>
    )
}

export default Header

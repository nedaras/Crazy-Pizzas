import { FC } from 'react'
//import styles from '../../styles/Header.module.scss'
import Icons from './Icons'
import Routs from './Routes'
import 'bootstrap/dist/css/bootstrap.css'


const Header: FC = () => {
    return (
        <div>
            <Routs />
            <Icons />
        </div>
    )
}

export default Header

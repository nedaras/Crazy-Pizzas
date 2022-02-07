import { FC } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faInstagram, faDiscord } from "@fortawesome/free-brands-svg-icons"
import Link from "next/link"
import styles from '../styles/Header.module.scss'
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { motion } from 'framer-motion'

interface IconProps {
    href: string,
    icon: IconProp

}

const Header: FC = () => {

    return <div className={styles.header} >
        <Icon href='https://twitter.com/CrazyPizzaNFT' icon={faTwitter} />
        <Icon href='https://www.instagram.com/crazypizzanft/' icon={faInstagram} />
        <Icon href='https://discord.gg/UmP8NnCQ' icon={faDiscord} />

    </div>

}

const Icon: FC<IconProps> = ({ href, icon }) => {
    return <Link href={href} >
        <motion.div

            initial={{ y: 1 }}
            whileHover={{ y: -5 }}
            exit={{ y: 1 }}

        >
            <FontAwesomeIcon className={styles.icon} icon={icon} />
        </motion.div>
    </Link>

}

export default Header
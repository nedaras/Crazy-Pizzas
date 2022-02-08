import { FC } from 'react'
import Link from 'next/link'
import styles from '../../styles/Header.module.scss'
import { motion } from 'framer-motion'

interface RoutProps {
    href: string
}

const Icons: FC = () => {
    return (
        <div>
            <Rout href="/mint">Mint</Rout>
        </div>
    )
}

const Rout: FC<RoutProps> = ({ children, href }) => {
    return (
        <Link href={href}>
            <motion.div className={styles.rout} initial={{ y: 1 }} whileHover={{ y: -5 }} exit={{ y: 1 }}>
                {children}
            </motion.div>
        </Link>
    )
}

export default Icons

import { FC } from 'react'
import styles from '../styles/Title.module.scss'

interface TitleProps {
    className?: string
}

const Title: FC<TitleProps> = ({ className }) => {
    const title = <div className={styles.title}>Crazy Pizzas</div>

    return className ? <div className={className}>{title}</div> : title
}

export default Title

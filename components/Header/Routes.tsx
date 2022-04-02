import Link from 'next/link'
import { FC } from 'react'
import { Nav } from 'react-bootstrap'

interface RoutProps {
    href: string
}

const Routes: FC = () => {
    return (
        <>
            <Rout href="/mint">Mint</Rout>
            <Rout href="/mint">Roadmap</Rout>
        </>
    )
}

const Rout: FC<RoutProps> = ({ children, href }) => {
    return (
        <Link passHref href={href}>
            <Nav.Link active={false}>{children}</Nav.Link>
        </Link>
    )
}

export default Routes

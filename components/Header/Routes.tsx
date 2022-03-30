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
    return <Nav.Link href={href}>{children}</Nav.Link>
}

export default Routes

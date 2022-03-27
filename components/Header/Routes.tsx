import { FC } from 'react'
import { Nav } from 'react-bootstrap'

interface RoutProps {
    href: string
}

const Icons: FC = () => {
    return <Rout href="/mint">Mint</Rout>
}

const Rout: FC<RoutProps> = ({ children, href }) => {
    return <Nav.Link href={href}>{children}</Nav.Link>
}

export default Icons

import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import Nav from 'react-bootstrap/Nav'

interface RoutProps {
    href: string
}

const Routes: FC = () => {
    return (
        <>
            <Rout href="/404">Something</Rout>
        </>
    )
}

const Rout: FC<RoutProps> = ({ children, href }) => {
    const router = useRouter()

    return (
        <Link href={href} passHref>
            <Nav.Link active={router.pathname == href}>{children}</Nav.Link>
        </Link>
    )
}

export default Routes

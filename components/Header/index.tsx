import { FC } from 'react'
import { Container, Dropdown, Nav, Navbar, NavItem, NavLink, SSRProvider } from 'react-bootstrap'
import Routes from './Routes'
import Icons from './Icons'
import Link from 'next/link'

const Header: FC = () => {
    return (
        <SSRProvider>
            <Navbar variant="dark" bg="dark" expand="md" sticky="top">
                <Container>
                    <Link passHref={true} href="/">
                        <Navbar.Brand>Crazy Pizzas</Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <Routes />
                            <NavDropdown>
                                <Icons />
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </SSRProvider>
    )
}

const NavDropdown: FC = ({ children }) => {
    return (
        <Dropdown as={NavItem}>
            <Dropdown.Toggle as={NavLink}>Media</Dropdown.Toggle>
            <Dropdown.Menu variant="dark">{children}</Dropdown.Menu>
        </Dropdown>
    )
}

export default Header

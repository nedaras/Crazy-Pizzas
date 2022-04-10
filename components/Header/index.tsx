import type { FC } from 'react'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavItem from 'react-bootstrap/NavItem'
import NavLink from 'react-bootstrap/NavLink'
import Routes from './Routes'
import Icons from './Icons'
import Link from 'next/link'

const Header: FC = () => {
    return (
        <Navbar variant="dark" bg="dark" expand="md" sticky="top">
            <Container>
                <Link href="/" passHref>
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

import { FC } from 'react'
import { Container, Dropdown, Nav, Navbar, NavItem, NavLink, SSRProvider } from 'react-bootstrap'
import Icons from './Icons'
import Routes from './Routes'

const Header: FC = () => {
    return (
        <SSRProvider>
            <Navbar variant="dark" bg="dark" expand="md" sticky="top">
                <Container>
                    <Navbar.Brand href="/">Crazy Pizzas</Navbar.Brand>
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

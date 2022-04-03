import { FC } from 'react'
import { Container, Dropdown, Nav, Navbar, NavItem, NavLink } from 'react-bootstrap'
import Routes from './Routes'
import Icons from './Icons'

const Header: FC = () => {
    return (
        <Navbar variant="dark" bg="dark" expand="md" sticky="top">
            <Container>
                <Navbar.Brand>Crazy Pizzas</Navbar.Brand>
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

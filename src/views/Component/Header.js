import React from "react";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default function Header(props) {
  const logout = () => {
    document.cookie = "shyechern=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
  }
  const { role } = props;

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant='dark'>
      <Navbar.Brand href="/finance">Shye Chern</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/finance">Finance</Nav.Link>
          {
            role === 'Admin' && <Nav.Link href="/market">Update Market</Nav.Link>
          }
          <NavDropdown title="Some Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#...">This</NavDropdown.Item>
            <NavDropdown.Item href="#...">Is</NavDropdown.Item>
            <NavDropdown.Item href="#...">Shye Chern</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#...">...</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
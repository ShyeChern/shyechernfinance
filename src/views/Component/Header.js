import React from "react";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { baseUrl, secret } from "util/constant.js";

export default function Header(props) {
  const logout = () => {
    fetch(baseUrl + `user/logout/${localStorage.getItem('scUserId')}`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic ' + secret,
        timestamp: new Date().getTime(),
      },
      credentials: 'include',
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(res.json());
      }
    })
      .then((resBody) => {
        if (resBody.result) {
          localStorage.removeItem('scUserId');
          window.location.href = '/';
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
  const { role } = props;

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant='dark'>
      <Navbar.Brand href="/stock">Shye Chern</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/stock">Stock</Nav.Link>
          {
            role === 'Admin' && <Nav.Link href="/market">Update Market</Nav.Link>
          }
          <NavDropdown title="Some Dropdown for Calculation?" id="collasible-nav-dropdown">
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
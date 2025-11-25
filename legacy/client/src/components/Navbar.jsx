import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import auth from '../utils/auth';

const NavigationBar = () => {
  const [loggedIn, setLoggedIn] = useState(auth.isLoggedIn()); // Use the instance directly

  useEffect(() => {
    const updateAuthStatus = () => {
      console.log(auth.isLoggedIn())
      setLoggedIn(auth.isLoggedIn());
    };

    window.addEventListener('authChange', updateAuthStatus);
    updateAuthStatus();

    return () => {
      window.removeEventListener('authChange', updateAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    auth.logout(); // Use the instance directly
    updateAuthStatus();
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Bloglog</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
            {loggedIn && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {loggedIn ? (
              <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

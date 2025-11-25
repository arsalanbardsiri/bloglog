import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { LOGIN_USER } from '../utils/mutations';
import auth from '../utils/auth';

const LoginForm = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await loginUser({ variables: { ...formState } });
      auth.setToken(data.loginUser.token); // Corrected usage
      window.location.assign('/profile'); // Redirect to profile page
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form onSubmit={handleFormSubmit} className="mt-4">
            <Form.Group controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                value={formState.email}
                required
              />
            </Form.Group>
            <Form.Group controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                value={formState.password}
                required
              />
            </Form.Group>
            <Button variant="secondary" type="submit" className="mt-3 w-100">
              Login
            </Button>
            {error && <Alert variant="danger" className="mt-3">Login Failed: {error.message}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;

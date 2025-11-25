import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { CREATE_USER } from '../utils/mutations';
import Auth  from '../utils/auth';

const RegisterForm = () => {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });
  const [createUser, { error }] = useMutation(CREATE_USER);
  const [registrationError, setRegistrationError] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await createUser({ variables: { ...formState } });
      Auth.setToken(data.createUser.token); // Set token on successful registration
      window.location.assign('/profile'); // Redirect to profile page
    } catch (e) {
      console.error(e);
      setRegistrationError(e.message || 'Registration failed');
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
            <Form.Group controlId="registerUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={handleChange}
                value={formState.username}
                required
              />
            </Form.Group>
            <Form.Group controlId="registerEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                value={formState.email}
                required
              />
            </Form.Group>
            <Form.Group controlId="registerPassword">
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
              Register
            </Button>
            {error && <Alert variant="danger" className="mt-3">Registration Failed: {error.message}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;

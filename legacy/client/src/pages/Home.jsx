import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container>
      <Row className="align-items-center my-5">
        <Col>
          <h1>Welcome to Bloglog!</h1>
          <p>Your one-stop platform for insightful and engaging blog content.</p>
          <Button as={Link} to="/blog" variant="secondary">Explore Blogs</Button>
        </Col>
      </Row>
      {/* Additional sections or promotional content can be added here */}
    </Container>
  );
}

export default Home;

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => {
    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h2>About Bloglog</h2>
                    <p>Welcome to Bloglog, a platform dedicated to connecting writers and readers around the globe. Our mission is to provide a space for sharing thoughts, ideas, and stories.</p>
                    <p>Whether you're a seasoned blogger or just starting out, Bloglog is the perfect place to express yourself and discover new perspectives.</p>
                    <p>Log Blog at Bloglog</p>
                </Col>
            </Row>
            {/* Additional sections or content can go here */}
        </Container>
    );
};

export default About;

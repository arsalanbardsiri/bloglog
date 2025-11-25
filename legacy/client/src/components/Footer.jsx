import React from 'react';
import { Container } from 'react-bootstrap';
import DonationButton from './DonationButton'; // Adjust the path if necessary

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white text-center text-lg-start">
      <Container className="p-4 d-flex justify-content-between">
        <span>Blog Footer</span>
        <DonationButton />
      </Container>
    </footer>
  );
};

export default Footer;

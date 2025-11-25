import React from 'react';
import { Button } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const DonationButton = () => {
  const handleClick = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/stripe/create-payment-intent', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('There was an issue:', error);
    }
  };

  return <Button variant="secondary" onClick={handleClick}>Donate</Button>;
};

export default DonationButton;

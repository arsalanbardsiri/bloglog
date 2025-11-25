// Routes for handling Stripe payments
const express = require('express');
const stripeController = require('../controllers/stripeController');
const router = express.Router();

// Route for creating a payment intent
router.post('/create-payment-intent', stripeController.createPaymentIntent);

// Route for handling Stripe webhook
router.post('/webhook', stripeController.handleStripeWebhook);

module.exports = router;

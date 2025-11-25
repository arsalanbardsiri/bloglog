require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Assuming you have a model to track donations or payments
const Donation = require('../models/Donation');

exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body; // Ensure this is in the smallest currency unit (e.g., cents)

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            // additional Stripe parameters
        });

        // Optionally save the intent details in your database
        const donation = new Donation({
            amount,
            paymentIntentId: paymentIntent.id,
            status: 'Created'
        });
        await donation.save();

        res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ message: 'Error creating payment intent', err });
    }
};

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.rawBody, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Handle different event types
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            // Update donation/payment status in your database
            await Donation.findOneAndUpdate(
                { paymentIntentId: paymentIntent.id },
                { status: 'Succeeded' }
            );
            // Additional logic for successful payment
        }

        res.status(200).json({ received: true });
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

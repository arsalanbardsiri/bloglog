import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16', // Use a fixed version for stability
    typescript: true,
});

export default stripe;

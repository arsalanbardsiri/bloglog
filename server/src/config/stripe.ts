import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing in environment variables');
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('Stripe Key Loaded:', stripeSecretKey.substring(0, 10) + '...');

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16', // Use a fixed version for stability
    typescript: true,
});

export default stripe;

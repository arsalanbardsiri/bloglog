import { Request, Response } from 'express';
import stripe from '../config/stripe';

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { priceId } = req.body;

        // For this demo, we'll use a hardcoded price or create a one-time session
        // In a real app, you'd look up the price from your DB or Stripe

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Blog Lounge Premium',
                            description: 'Access to exclusive system design content',
                        },
                        unit_amount: 1000, // $10.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/pricing`,
        });

        res.json({ id: session.id });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
};

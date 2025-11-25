import { Router } from 'express';
import { createCheckoutSession } from '../controllers/stripeController';
import { idempotency } from '../middleware/idempotency';

const router = Router();

// Apply idempotency middleware to payment creation
router.post('/create-checkout-session', idempotency, createCheckoutSession);

export default router;

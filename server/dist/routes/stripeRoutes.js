"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripeController_1 = require("../controllers/stripeController");
const idempotency_1 = require("../middleware/idempotency");
const router = (0, express_1.Router)();
// Apply idempotency middleware to payment creation
router.post('/create-checkout-session', idempotency_1.idempotency, stripeController_1.createCheckoutSession);
exports.default = router;

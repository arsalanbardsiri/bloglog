"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
const rateLimiter_1 = require("./middleware/rateLimiter");
// Rate Limiting: 100 requests per 15 minutes
app.use((0, rateLimiter_1.rateLimiter)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
}));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const stripeRoutes_1 = __importDefault(require("./routes/stripeRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Routes
app.use('/api/posts', postRoutes_1.default);
app.use('/api/stripe', stripeRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

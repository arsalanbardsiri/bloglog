import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

interface RateLimitOptions {
    windowMs: number; // Window size in milliseconds
    max: number; // Max requests per window
    message?: string;
}

export const rateLimiter = (options: RateLimitOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const key = `rate_limit:${ip}`;

        try {
            const requests = await redis.incr(key);

            if (requests === 1) {
                await redis.expire(key, options.windowMs / 1000);
            }

            if (requests > options.max) {
                return res.status(429).json({
                    status: 'error',
                    message: options.message || 'Too many requests, please try again later.',
                });
            }

            next();
        } catch (error) {
            console.error('Rate limiter error:', error);
            // Fail open if Redis is down
            next();
        }
    };
};

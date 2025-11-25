import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

export const idempotency = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers['idempotency-key'];

    if (!key) {
        return next();
    }

    const redisKey = `idempotency:${key}`;

    try {
        const cachedResponse = await redis.get(redisKey);

        if (cachedResponse) {
            console.log(`Serving idempotent response for key: ${key}`);
            const { status, body } = JSON.parse(cachedResponse);
            return res.status(status).json(body);
        }

        // Intercept res.json to cache the response
        const originalJson = res.json;
        res.json = (body: any) => {
            res.json = originalJson; // Restore original to avoid infinite loop if called again

            // Cache the response for 24 hours
            redis.setex(redisKey, 60 * 60 * 24, JSON.stringify({
                status: res.statusCode,
                body
            }));

            return res.json(body);
        };

        next();
    } catch (error) {
        console.error('Idempotency error:', error);
        next();
    }
};

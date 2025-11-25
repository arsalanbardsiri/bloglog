"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotency = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const idempotency = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.headers['idempotency-key'];
    if (!key) {
        return next();
    }
    const redisKey = `idempotency:${key}`;
    try {
        const cachedResponse = yield redis_1.default.get(redisKey);
        if (cachedResponse) {
            console.log(`Serving idempotent response for key: ${key}`);
            const { status, body } = JSON.parse(cachedResponse);
            return res.status(status).json(body);
        }
        // Intercept res.json to cache the response
        const originalJson = res.json;
        res.json = (body) => {
            res.json = originalJson; // Restore original to avoid infinite loop if called again
            // Cache the response for 24 hours
            redis_1.default.setex(redisKey, 60 * 60 * 24, JSON.stringify({
                status: res.statusCode,
                body
            }));
            return res.json(body);
        };
        next();
    }
    catch (error) {
        console.error('Idempotency error:', error);
        next();
    }
});
exports.idempotency = idempotency;

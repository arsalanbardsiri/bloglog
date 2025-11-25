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
exports.rateLimiter = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const rateLimiter = (options) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const key = `rate_limit:${ip}`;
        try {
            const requests = yield redis_1.default.incr(key);
            if (requests === 1) {
                yield redis_1.default.expire(key, options.windowMs / 1000);
            }
            if (requests > options.max) {
                return res.status(429).json({
                    status: 'error',
                    message: options.message || 'Too many requests, please try again later.',
                });
            }
            next();
        }
        catch (error) {
            console.error('Rate limiter error:', error);
            // Fail open if Redis is down
            next();
        }
    });
};
exports.rateLimiter = rateLimiter;

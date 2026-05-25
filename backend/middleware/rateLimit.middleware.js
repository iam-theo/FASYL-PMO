import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,

    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },

    standardHeaders: true,
    legacyHeaders: false
})

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    skipSuccessfulRequests: true,

    message: {
        success: false,
        message: "Too many login attempts. Try again in 15 minutes.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,

    message: {
        success: false,
        message: "Too many registration attempts.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,

    message: {
        success: false,
        message: "Too many token refresh attempts.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,

    message: {
        success: false,
        message: "Too many write operations.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,

    message: {
        success: false,
        message: "Too many file uploads.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export const authSlowDown = slowDown({
    windowMs: 15 * 60 * 1000,

    delayAfter: 3,

    delayMs: () => 500,

    axDelayMs: 5000,
});
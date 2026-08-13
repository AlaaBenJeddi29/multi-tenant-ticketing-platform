import rateLimit from "express-rate-limit";

/**
 * Strict rate limiter for authentication endpoints
 * Protects against brute-force attacks on login, register, forgot-password, and reset-password
 * 10 requests per 15 minutes per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many attempts, please try again later.",
    });
  },
  // Skip successful requests from counting against the limit
  skipSuccessfulRequests: false,
  // Skip failed requests from counting against the limit
  skipFailedRequests: false,
});

/**
 * General rate limiter for all API endpoints
 * Protects against runaway clients and abuse
 * 300 requests per 15 minutes per IP
 */
export const generalApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many attempts, please try again later.",
    });
  },
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

const { rateLimit } = require('express-rate-limit');

const skip = () => process.env.NODE_ENV === 'test';

const common = {
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.' },
};

const apiLimiter = rateLimit({ ...common, windowMs: 15 * 60 * 1000, limit: 300 });
const loginLimiter = rateLimit({ ...common, windowMs: 15 * 60 * 1000, limit: 10 });
const orderLimiter = rateLimit({ ...common, windowMs: 60 * 60 * 1000, limit: 30 });

module.exports = { apiLimiter, loginLimiter, orderLimiter };


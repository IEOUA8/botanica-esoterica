const { rateLimit } = require('express-rate-limit');

const common = {
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.' },
};

const apiLimiter = rateLimit({ ...common, windowMs: 15 * 60 * 1000, limit: 300 });
const loginLimiter = rateLimit({ ...common, windowMs: 15 * 60 * 1000, limit: 10 });
const orderLimiter = rateLimit({ ...common, windowMs: 60 * 60 * 1000, limit: 30 });

module.exports = { apiLimiter, loginLimiter, orderLimiter };


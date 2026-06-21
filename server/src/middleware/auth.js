const jwt = require('jsonwebtoken');
const env = require('../config/env');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token requerido.' });
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Sesión inválida o expirada.' });
  }
}

module.exports = { requireAuth };

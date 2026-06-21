const express = require('express');
const { login, me, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimits');
const { validateRequest } = require('../middleware/validate');
const { loginValidation } = require('../middleware/validators');

const router = express.Router();

router.post('/login', loginLimiter, loginValidation, validateRequest, login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

module.exports = router;

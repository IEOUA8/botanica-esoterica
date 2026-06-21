const express = require('express');
const { createOrder } = require('../controllers/orderController');
const { orderLimiter } = require('../middleware/rateLimits');
const { validateRequest } = require('../middleware/validate');
const { orderValidation } = require('../middleware/validators');

const router = express.Router();

router.post('/', orderLimiter, orderValidation, validateRequest, createOrder);

module.exports = router;

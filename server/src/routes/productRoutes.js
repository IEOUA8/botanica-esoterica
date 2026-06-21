const express = require('express');
const {
  listProducts,
  featuredProducts,
  productBySlug,
  productsByCategory,
} = require('../controllers/productController');
const { validateRequest } = require('../middleware/validate');
const { catalogQueryValidation, slugValidation } = require('../middleware/validators');

const router = express.Router();

router.get('/', catalogQueryValidation, validateRequest, listProducts);
router.get('/featured', featuredProducts);
router.get('/category/:slug', slugValidation, catalogQueryValidation, validateRequest, productsByCategory);
router.get('/:slug', slugValidation, validateRequest, productBySlug);

module.exports = router;

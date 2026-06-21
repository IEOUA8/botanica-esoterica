const express = require('express');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');
const {
  idValidation,
  productValidation,
  productStatusValidation,
  categoryValidation,
  orderStatusValidation,
  paymentStatusValidation,
  shippingStatusValidation,
} = require('../middleware/validators');

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard/stats', dashboardController.stats);

router.get('/products', productController.adminListProducts);
router.post('/products', productValidation, validateRequest, productController.createProduct);
router.get('/products/:id', idValidation, validateRequest, productController.adminProductById);
router.put('/products/:id', idValidation, productValidation, validateRequest, productController.updateProduct);
router.delete('/products/:id', idValidation, validateRequest, productController.deleteProduct);
router.patch('/products/:id/status', productStatusValidation, validateRequest, productController.updateProductStatus);

router.get('/categories', categoryController.adminListCategories);
router.post('/categories', categoryValidation, validateRequest, categoryController.createCategory);
router.put('/categories/:id', idValidation, categoryValidation, validateRequest, categoryController.updateCategory);
router.delete('/categories/:id', idValidation, validateRequest, categoryController.deleteCategory);

router.get('/orders', orderController.adminListOrders);
router.get('/orders/:id', idValidation, validateRequest, orderController.adminOrderById);
router.put('/orders/:id/status', orderStatusValidation, validateRequest, orderController.updateOrderStatus);
router.put('/orders/:id/payment-status', paymentStatusValidation, validateRequest, orderController.updatePaymentStatus);
router.put('/orders/:id/shipping-status', shippingStatusValidation, validateRequest, orderController.updateShippingStatus);

module.exports = router;

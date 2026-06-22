const { body, header, param, query } = require('express-validator');
const {
  PAYMENT_METHODS,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SHIPPING_STATUSES,
} = require('../constants/order');

const identifier = (name) => param(name)
  .trim()
  .isLength({ min: 1, max: 100 }).withMessage('Identificador inválido.')
  .matches(/^[\w-]+$/).withMessage('Identificador inválido.');

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido.').normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 128 }).withMessage('Contraseña inválida.'),
];

const catalogQueryValidation = [
  query('category').optional().trim().isLength({ max: 100 }),
  query('intention').optional().trim().isLength({ max: 100 }),
  query('search').optional().trim().isLength({ max: 100 }),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'best_seller', 'newest']).withMessage('Orden inválido.'),
  query('page').optional().isInt({ min: 1, max: 100000 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 48 }).toInt(),
];

const slugValidation = [identifier('slug')];
const idValidation = [identifier('id')];

const productValidation = [
  body('name').trim().isLength({ min: 2, max: 160 }).withMessage('Nombre inválido.'),
  body('description').trim().isLength({ min: 5, max: 5000 }).withMessage('Descripción inválida.'),
  body('shortDescription').optional().trim().isLength({ max: 300 }),
  body('categorySlug').trim().isLength({ min: 1, max: 100 }),
  body('intention').trim().isLength({ min: 2, max: 120 }),
  body('price').isFloat({ min: 0, max: 999999999 }).withMessage('Precio inválido.').toFloat(),
  body('compareAtPrice').optional().isFloat({ min: 0, max: 999999999 }).toFloat(),
  body('stock').isInt({ min: 0, max: 1000000 }).withMessage('Stock inválido.').toInt(),
  body('sku').optional().trim().isLength({ max: 100 }),
  body('slug').optional({ checkFalsy: true }).trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  body('mainImage').optional({ checkFalsy: true }).isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('URL de imagen inválida.'),
  body('images').optional().isArray({ max: 10 }),
  body('images.*').optional().isURL({ protocols: ['http', 'https'], require_protocol: true }),
  body('tags').optional().custom((value) => typeof value === 'string' || Array.isArray(value)).withMessage('Etiquetas inválidas.'),
  body('ingredients').optional().custom((value) => typeof value === 'string' || Array.isArray(value)).withMessage('Ingredientes inválidos.'),
  body('ritualUse').optional().trim().isLength({ max: 3000 }),
  body('warnings').optional().trim().isLength({ max: 2000 }),
  body('isFeatured').optional().isBoolean().toBoolean(),
  body('isActive').optional().isBoolean().toBoolean(),
];

const productStatusValidation = [
  ...idValidation,
  body('isActive').optional().isBoolean().toBoolean(),
  body('isFeatured').optional().isBoolean().toBoolean(),
  body().custom((value) => value.isActive !== undefined || value.isFeatured !== undefined)
    .withMessage('Debes enviar un estado válido.'),
];

const categoryValidation = [
  body('name').trim().isLength({ min: 2, max: 120 }),
  body('slug').optional({ checkFalsy: true }).trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('image').optional({ checkFalsy: true }).isURL({ protocols: ['http', 'https'], require_protocol: true }),
  body('isActive').optional().isBoolean().toBoolean(),
  body('order').optional().isInt({ min: 0, max: 10000 }).toInt(),
];

const orderValidation = [
  header('idempotency-key').isUUID().withMessage('Idempotency-Key es obligatorio y debe ser un UUID.'),
  body('customer').isObject().withMessage('Datos de cliente inválidos.'),
  body('customer.fullName').trim().isLength({ min: 2, max: 120 }),
  body('customer.phone').trim().isLength({ min: 7, max: 30 }),
  body('customer.email').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  body('customer.city').trim().isLength({ min: 2, max: 120 }),
  body('customer.address').trim().isLength({ min: 5, max: 250 }),
  body('customer.notes').optional().trim().isLength({ max: 1000 }),
  body('items').isArray({ min: 1, max: 50 }).withMessage('El pedido debe tener entre 1 y 50 productos.'),
  body('items.*.product').trim().isLength({ min: 1, max: 100 }).matches(/^[\w-]+$/),
  body('items.*.quantity').isInt({ min: 1, max: 99 }).withMessage('Cantidad inválida.').toInt(),
  body('paymentMethod').isIn(PAYMENT_METHODS).withMessage('Método de pago inválido.'),
];

const orderStatusValidation = [
  ...idValidation,
  body('orderStatus').isIn(ORDER_STATUSES).withMessage('Estado de pedido inválido.'),
  body('adminNotes').optional().trim().isLength({ max: 2000 }),
];
const paymentStatusValidation = [...idValidation, body('paymentStatus').isIn(PAYMENT_STATUSES).withMessage('Estado de pago inválido.')];
const shippingStatusValidation = [...idValidation, body('shippingStatus').isIn(SHIPPING_STATUSES).withMessage('Estado de envío inválido.')];

module.exports = {
  loginValidation,
  catalogQueryValidation,
  slugValidation,
  idValidation,
  productValidation,
  productStatusValidation,
  categoryValidation,
  orderValidation,
  orderStatusValidation,
  paymentStatusValidation,
  shippingStatusValidation,
};

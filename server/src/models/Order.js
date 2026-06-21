const mongoose = require('mongoose');
const {
  PAYMENT_METHODS,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SHIPPING_STATUSES,
} = require('../constants/order');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    idempotencyKey: { type: String, required: true, unique: true },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      city: { type: String, required: true },
      address: { type: String, required: true },
      notes: { type: String, default: '' },
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true, enum: PAYMENT_METHODS },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'Pendiente' },
    orderStatus: { type: String, enum: ORDER_STATUSES, default: 'Nuevo' },
    shippingStatus: { type: String, enum: SHIPPING_STATUSES, default: 'Pendiente de despacho' },
    adminNotes: { type: String, default: '' },
    inventoryRestored: { type: Boolean, default: false },
    inventoryRestoredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

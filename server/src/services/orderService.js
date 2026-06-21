const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const env = require('../config/env');
const { ORDER_TRANSITIONS } = require('../constants/order');
const { createOrderNumber } = require('../utils/orderNumber');

class OrderServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'OrderServiceError';
    this.status = status;
  }
}

function mergeItems(items) {
  const merged = new Map();
  for (const item of items) {
    const quantity = (merged.get(item.product) || 0) + Number(item.quantity);
    if (quantity > 99) throw new OrderServiceError('La cantidad máxima por producto es 99.');
    merged.set(item.product, quantity);
  }
  return [...merged].map(([product, quantity]) => ({ product, quantity }));
}

function calculateShippingCost(subtotal) {
  if (env.freeShippingThreshold > 0 && subtotal >= env.freeShippingThreshold) return 0;
  return env.shippingFlatRate;
}

function assertTransition(currentStatus, nextStatus) {
  if (currentStatus === nextStatus) return;
  if (!ORDER_TRANSITIONS[currentStatus]?.includes(nextStatus)) {
    throw new OrderServiceError(`No se puede cambiar el pedido de “${currentStatus}” a “${nextStatus}”.`);
  }
}

async function createPersistentOrder({ customer, items, paymentMethod, idempotencyKey }) {
  const previous = await Order.findOne({ idempotencyKey });
  if (previous) return { order: previous, created: false };

  const session = await mongoose.startSession();
  let order;
  let created = true;

  try {
    await session.withTransaction(async () => {
      const repeated = await Order.findOne({ idempotencyKey }).session(session);
      if (repeated) {
        order = repeated;
        created = false;
        return;
      }

      const resolvedItems = [];
      for (const item of mergeItems(items)) {
        let product;
        try {
          product = await Product.findOneAndUpdate(
            { _id: item.product, isActive: true, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity, soldCount: item.quantity } },
            { returnDocument: 'after', session, runValidators: true }
          );
        } catch (error) {
          if (error.name === 'CastError') throw new OrderServiceError(`Producto no disponible: ${item.product}`);
          throw error;
        }

        if (!product) throw new OrderServiceError(`Producto sin stock o no disponible: ${item.product}`);
        resolvedItems.push({
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          image: product.mainImage,
        });
      }

      const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingCost = calculateShippingCost(subtotal);
      [order] = await Order.create([{
        orderNumber: createOrderNumber(),
        idempotencyKey,
        customer,
        items: resolvedItems,
        subtotal,
        shippingCost,
        total: subtotal + shippingCost,
        paymentMethod,
      }], { session });
    });
  } catch (error) {
    if (error?.code === 11000) {
      const repeated = await Order.findOne({ idempotencyKey });
      if (repeated) return { order: repeated, created: false };
    }
    throw error;
  } finally {
    await session.endSession();
  }

  return { order, created };
}

async function updatePersistentOrderStatus(id, nextStatus, adminNotes) {
  const session = await mongoose.startSession();
  let updatedOrder;

  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(id).session(session);
      if (!order) throw new OrderServiceError('Pedido no encontrado.', 404);
      assertTransition(order.orderStatus, nextStatus);

      if (nextStatus === 'Cancelado' && !order.inventoryRestored) {
        await Promise.all(order.items.map((item) => Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity, soldCount: -item.quantity } },
          { session, runValidators: true }
        )));
        order.inventoryRestored = true;
        order.inventoryRestoredAt = new Date();
      }

      order.orderStatus = nextStatus;
      if (adminNotes !== undefined) order.adminNotes = adminNotes;
      updatedOrder = await order.save({ session });
    });
  } finally {
    await session.endSession();
  }

  return updatedOrder;
}

module.exports = {
  OrderServiceError,
  assertTransition,
  calculateShippingCost,
  mergeItems,
  createPersistentOrder,
  updatePersistentOrderStatus,
};

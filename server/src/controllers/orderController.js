const Order = require('../models/Order');
const { dbReady } = require('../config/db');
const demoStore = require('../services/demoStore');
const {
  assertTransition,
  calculateShippingCost,
  createPersistentOrder,
  mergeItems,
  updatePersistentOrderStatus,
} = require('../services/orderService');

async function createOrder(req, res) {
  const { customer, items, paymentMethod } = req.body;
  const idempotencyKey = req.get('Idempotency-Key');
  if (!customer || !items?.length || !paymentMethod) {
    return res.status(400).json({ message: 'Datos de cliente, productos y método de pago son obligatorios.' });
  }

  if (!dbReady()) {
    const previous = demoStore.orders.find((order) => order.idempotencyKey === idempotencyKey);
    if (previous) {
      return res.status(200).json({ order: previous, whatsappMessage: buildWhatsappMessage(previous), idempotentReplay: true });
    }
    const mergedItems = mergeItems(items);
    for (const item of mergedItems) {
      const product = demoStore.products.find((candidate) => candidate._id === item.product && candidate.isActive);
      if (!product) return res.status(400).json({ message: `Producto no disponible: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Stock insuficiente para ${product.name}.` });
    }
    const subtotal = mergedItems.reduce((sum, item) => {
      const product = demoStore.products.find((candidate) => candidate._id === item.product);
      return sum + product.price * item.quantity;
    }, 0);
    const order = demoStore.createOrder({
      customer,
      items: mergedItems,
      paymentMethod,
      idempotencyKey,
      shippingCost: calculateShippingCost(subtotal),
    });
    return res.status(201).json({ order, whatsappMessage: buildWhatsappMessage(order) });
  }

  const result = await createPersistentOrder({ customer, items, paymentMethod, idempotencyKey });
  return res.status(result.created ? 201 : 200).json({
    order: result.order,
    whatsappMessage: buildWhatsappMessage(result.order),
    idempotentReplay: !result.created,
  });
}

async function adminListOrders(req, res) {
  if (!dbReady()) return res.json(demoStore.orders);
  const orders = await Order.find().sort({ createdAt: -1 });
  return res.json(orders);
}

async function adminOrderById(req, res) {
  if (!dbReady()) {
    const order = demoStore.orders.find((item) => item._id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' });
    return res.json(order);
  }
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' });
  return res.json(order);
}

async function updateOrderStatus(req, res) {
  if (!dbReady()) {
    const order = demoStore.orders.find((item) => item._id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' });
    assertTransition(order.orderStatus, req.body.orderStatus);
    if (req.body.orderStatus === 'Cancelado' && !order.inventoryRestored) {
      for (const item of order.items) {
        const product = demoStore.products.find((candidate) => candidate._id === item.product);
        if (product) {
          product.stock += item.quantity;
          product.soldCount = Math.max(0, product.soldCount - item.quantity);
        }
      }
      order.inventoryRestored = true;
      order.inventoryRestoredAt = new Date();
    }
    Object.assign(order, { orderStatus: req.body.orderStatus, adminNotes: req.body.adminNotes ?? order.adminNotes, updatedAt: new Date() });
    return res.json(order);
  }

  const order = await updatePersistentOrderStatus(req.params.id, req.body.orderStatus, req.body.adminNotes);
  return res.json(order);
}

async function updatePaymentStatus(req, res) {
  return updateOrder(req, res, { paymentStatus: req.body.paymentStatus });
}

async function updateShippingStatus(req, res) {
  return updateOrder(req, res, { shippingStatus: req.body.shippingStatus });
}

async function updateOrder(req, res, payload) {
  const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
  if (!dbReady()) {
    const order = demoStore.orders.find((item) => item._id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' });
    Object.assign(order, cleanPayload, { updatedAt: new Date() });
    return res.json(order);
  }
  const order = await Order.findByIdAndUpdate(req.params.id, cleanPayload, { returnDocument: 'after', runValidators: true });
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' });
  return res.json(order);
}

function buildWhatsappMessage(order) {
  const lines = [
    `Hola, quiero confirmar mi pedido ${order.orderNumber}.`,
    `Cliente: ${order.customer.fullName}`,
    `Ciudad: ${order.customer.city}`,
    'Productos:',
    ...order.items.map((item) => `- ${item.quantity} x ${item.name}: $${item.price.toLocaleString('es-CO')}`),
    `Total: $${order.total.toLocaleString('es-CO')}`,
    `Método de pago: ${order.paymentMethod}`,
  ];
  return lines.join('\n');
}

module.exports = {
  createOrder,
  adminListOrders,
  adminOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  updateShippingStatus,
};

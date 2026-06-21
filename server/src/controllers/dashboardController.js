const Product = require('../models/Product');
const Order = require('../models/Order');
const { dbReady } = require('../config/db');
const demoStore = require('../services/demoStore');

async function stats(req, res) {
  if (!dbReady()) {
    const activeProducts = demoStore.products.filter((product) => product.isActive);
    const lowStock = activeProducts.filter((product) => product.stock <= 5);
    const pendingDispatch = demoStore.orders.filter((order) => order.shippingStatus !== 'Despachado');
    const totalSales = demoStore.orders.reduce((sum, order) => sum + order.total, 0);
    return res.json({
      totalProducts: demoStore.products.length,
      activeProducts: activeProducts.length,
      lowStock: lowStock.length,
      newOrders: demoStore.orders.filter((order) => order.orderStatus === 'Nuevo').length,
      pendingDispatch: pendingDispatch.length,
      shippedOrders: demoStore.orders.filter((order) => order.shippingStatus === 'Despachado').length,
      totalSales,
    });
  }

  const [totalProducts, activeProducts, lowStock, newOrders, pendingDispatch, shippedOrders, sales] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),
    Order.countDocuments({ orderStatus: 'Nuevo' }),
    Order.countDocuments({ shippingStatus: { $ne: 'Despachado' } }),
    Order.countDocuments({ shippingStatus: 'Despachado' }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
  ]);

  return res.json({
    totalProducts,
    activeProducts,
    lowStock,
    newOrders,
    pendingDispatch,
    shippedOrders,
    totalSales: sales[0]?.total || 0,
  });
}

module.exports = { stats };

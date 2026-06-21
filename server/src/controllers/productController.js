const Product = require('../models/Product');
const Category = require('../models/Category');
const { dbReady } = require('../config/db');
const demoStore = require('../services/demoStore');
const { toSlug } = require('../utils/slug');

function mongoQuery(query) {
  const filter = { isActive: true };
  if (query.category) filter.categorySlug = query.category;
  if (query.intention) filter.intention = new RegExp(escapeRegex(query.intention), 'i');
  if (query.search) {
    const term = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ name: term }, { description: term }, { intention: term }, { categoryName: term }];
  }
  return filter;
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sortQuery(sort) {
  if (sort === 'price_asc') return { price: 1 };
  if (sort === 'price_desc') return { price: -1 };
  if (sort === 'best_seller') return { soldCount: -1 };
  return { createdAt: -1 };
}

async function listProducts(req, res) {
  if (!dbReady()) return res.json(demoStore.listProducts(req.query));
  const products = await Product.find(mongoQuery(req.query)).sort(sortQuery(req.query.sort)).populate('category');
  return res.json(products);
}

async function featuredProducts(req, res) {
  if (!dbReady()) return res.json(demoStore.listProducts({ featured: 'true' }).slice(0, 8));
  const products = await Product.find({ isActive: true, isFeatured: true }).sort({ createdAt: -1 }).limit(8).populate('category');
  return res.json(products);
}

async function productBySlug(req, res) {
  if (!dbReady()) {
    const product = demoStore.products.find((item) => item.slug === req.params.slug && item.isActive);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
    return res.json(product);
  }
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category');
  if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
  return res.json(product);
}

async function productsByCategory(req, res) {
  req.query.category = req.params.slug;
  return listProducts(req, res);
}

async function adminListProducts(req, res) {
  if (!dbReady()) return res.json(demoStore.products);
  const products = await Product.find().sort({ createdAt: -1 }).populate('category');
  return res.json(products);
}

async function adminProductById(req, res) {
  if (!dbReady()) {
    const product = demoStore.products.find((item) => item._id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
    return res.json(product);
  }
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
  return res.json(product);
}

async function createProduct(req, res) {
  const payload = await normalizePayload(req.body);
  if (!dbReady()) return res.status(201).json(demoStore.createProduct(payload));
  const product = await Product.create(payload);
  return res.status(201).json(product);
}

async function updateProduct(req, res) {
  const payload = await normalizePayload(req.body);
  if (!dbReady()) {
    const product = demoStore.updateProduct(req.params.id, payload);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
    return res.json(product);
  }
  const product = await Product.findByIdAndUpdate(req.params.id, payload, { returnDocument: 'after', runValidators: true });
  if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
  return res.json(product);
}

async function deleteProduct(req, res) {
  if (!dbReady()) {
    const product = demoStore.updateProduct(req.params.id, { isActive: false });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
    return res.json(product);
  }
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { returnDocument: 'after' });
  if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
  return res.json(product);
}

async function updateProductStatus(req, res) {
  const status = {};
  if (req.body.isActive !== undefined) status.isActive = req.body.isActive;
  if (req.body.isFeatured !== undefined) status.isFeatured = req.body.isFeatured;
  const product = !dbReady()
    ? demoStore.updateProduct(req.params.id, status)
    : await Product.findByIdAndUpdate(req.params.id, status, { returnDocument: 'after', runValidators: true });
  if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
  return res.json(product);
}

async function normalizePayload(body) {
  const payload = {
    name: body.name,
    description: body.description,
    shortDescription: body.shortDescription || '',
    categorySlug: body.categorySlug,
    intention: body.intention,
    slug: body.slug || toSlug(body.name),
    price: Number(body.price || 0),
    compareAtPrice: Number(body.compareAtPrice || 0),
    stock: Number(body.stock || 0),
    sku: body.sku || '',
    tags: Array.isArray(body.tags) ? body.tags : String(body.tags || '').split(',').map((item) => item.trim()).filter(Boolean),
    ingredients: Array.isArray(body.ingredients) ? body.ingredients : String(body.ingredients || '').split(',').map((item) => item.trim()).filter(Boolean),
    ritualUse: body.ritualUse || '',
    warnings: body.warnings,
    isFeatured: body.isFeatured ?? false,
    isActive: body.isActive ?? true,
  };
  payload.images = Array.isArray(body.images) ? body.images : [body.mainImage].filter(Boolean);
  payload.mainImage = body.mainImage || payload.images[0] || '';
  if (!payload.warnings) delete payload.warnings;

  if (dbReady() && (body.category || body.categorySlug)) {
    const category = await Category.findOne({ $or: [{ _id: body.category }, { slug: body.categorySlug }] }).catch(() => null);
    if (category) {
      payload.category = category._id;
      payload.categoryName = category.name;
      payload.categorySlug = category.slug;
    }
  }

  return payload;
}

module.exports = {
  listProducts,
  featuredProducts,
  productBySlug,
  productsByCategory,
  adminListProducts,
  adminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
};

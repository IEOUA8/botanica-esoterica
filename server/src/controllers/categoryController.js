const Category = require('../models/Category');
const { dbReady } = require('../config/db');
const demoStore = require('../services/demoStore');
const { toSlug } = require('../utils/slug');

async function listCategories(req, res) {
  if (!dbReady()) return res.json(demoStore.categories.filter((category) => category.isActive));
  const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
  return res.json(categories);
}

async function adminListCategories(req, res) {
  if (!dbReady()) return res.json(demoStore.categories);
  const categories = await Category.find().sort({ order: 1, name: 1 });
  return res.json(categories);
}

async function createCategory(req, res) {
  const payload = categoryPayload(req.body);
  if (!dbReady()) {
    const category = { _id: `cat-${Date.now()}`, isActive: true, order: demoStore.categories.length + 1, ...payload };
    demoStore.categories.push(category);
    return res.status(201).json(category);
  }
  const category = await Category.create(payload);
  return res.status(201).json(category);
}

async function updateCategory(req, res) {
  const payload = categoryPayload(req.body);
  if (payload.name && !payload.slug) payload.slug = toSlug(payload.name);
  if (!dbReady()) {
    const index = demoStore.categories.findIndex((category) => category._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Categoría no encontrada.' });
    demoStore.categories[index] = { ...demoStore.categories[index], ...payload };
    return res.json(demoStore.categories[index]);
  }
  const category = await Category.findByIdAndUpdate(req.params.id, payload, { returnDocument: 'after', runValidators: true });
  if (!category) return res.status(404).json({ message: 'Categoría no encontrada.' });
  return res.json(category);
}

function categoryPayload(body) {
  return {
    name: body.name,
    slug: body.slug || toSlug(body.name),
    description: body.description || '',
    image: body.image || '',
    isActive: body.isActive ?? true,
    order: body.order ?? 0,
  };
}

async function deleteCategory(req, res) {
  if (!dbReady()) {
    const category = demoStore.categories.find((item) => item._id === req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada.' });
    category.isActive = false;
    return res.json(category);
  }
  const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { returnDocument: 'after' });
  if (!category) return res.status(404).json({ message: 'Categoría no encontrada.' });
  return res.json(category);
}

module.exports = { listCategories, adminListCategories, createCategory, updateCategory, deleteCategory };

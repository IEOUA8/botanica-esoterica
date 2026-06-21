const Category = require('../models/Category');
const Product = require('../models/Product');
const { dbReady } = require('../config/db');
const env = require('../config/env');
const demoStore = require('./demoStore');

async function ensureSeedData() {
  if (!dbReady() || !env.seedDemoData) return;

  let categoriesBySlug = new Map();
  if (await Category.countDocuments() === 0) {
    const categories = await Category.insertMany(demoStore.categories.map(({ _id, createdAt, updatedAt, ...category }) => category));
    categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));
  } else {
    const categories = await Category.find();
    categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));
  }

  if (await Product.countDocuments() === 0) {
    const products = demoStore.products.map(({ _id, category, image, createdAt, updatedAt, ...product }) => ({
      ...product,
      category: categoriesBySlug.get(product.categorySlug)?._id,
    }));
    await Product.insertMany(products);
    console.log(`Datos iniciales creados: ${categoriesBySlug.size} categorías y ${products.length} productos.`);
  }
}

module.exports = { ensureSeedData };


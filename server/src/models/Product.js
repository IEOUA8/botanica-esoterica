const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    categoryName: { type: String, default: '' },
    categorySlug: { type: String, default: '' },
    intention: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, default: '' },
    images: [{ type: String }],
    mainImage: { type: String, default: '' },
    tags: [{ type: String }],
    ingredients: [{ type: String }],
    ritualUse: { type: String, default: '' },
    warnings: { type: String, default: 'Producto de uso espiritual, ritual y simbólico. No sustituye atención profesional.' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

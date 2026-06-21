const { toSlug } = require('../utils/slug');
const { createOrderNumber } = require('../utils/orderNumber');

const categorySeed = [
  ['Suerte y abre caminos', 'Rituales para claridad, avance y oportunidades.', 'https://images.unsplash.com/photo-1603744193019-351f94d10fda?auto=format&fit=crop&w=900&q=80'],
  ['Amor y atracción', 'Elementos para intención afectiva y magnetismo personal.', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80'],
  ['Dinero y prosperidad', 'Kits, velas y aceites para prácticas de abundancia.', 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=80'],
  ['Protección espiritual', 'Amuletos y productos para cuidado energético.', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80'],
  ['Limpieza y descarga', 'Baños, hierbas e inciensos para renovación espiritual.', 'https://images.unsplash.com/photo-1600421683121-ef6f943f8cba?auto=format&fit=crop&w=900&q=80'],
  ['Kits rituales', 'Combinaciones preparadas para rituales conscientes.', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80'],
];

const categories = categorySeed.map(([name, description, image], index) => ({
  _id: `cat-${index + 1}`,
  name,
  slug: toSlug(name),
  description,
  image,
  isActive: true,
  order: index + 1,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const products = [
  {
    name: 'Kit de Abundancia Dorada',
    categorySlug: 'dinero-y-prosperidad',
    intention: 'Abundancia',
    price: 89000,
    compareAtPrice: 104000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Velas, hierbas y aceite para intencionar prosperidad.',
    description: 'Kit preparado para acompañar prácticas espirituales enfocadas en prosperidad, claridad y apertura de caminos materiales.',
    ingredients: ['Vela dorada', 'Aceite ritual', 'Hierbas seleccionadas', 'Incienso'],
    ritualUse: 'Prepara tu espacio, enciende la vela con intención y realiza una afirmación consciente durante siete minutos.',
    isFeatured: true,
    soldCount: 34,
  },
  {
    name: 'Vela Ritual Abre Caminos',
    categorySlug: 'suerte-y-abre-caminos',
    intention: 'Suerte',
    price: 32000,
    compareAtPrice: 0,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Vela intencionada para nuevos comienzos y movimiento.',
    description: 'Vela ritual para acompañar momentos de decisión, cambio y búsqueda de nuevas oportunidades.',
    ingredients: ['Cera', 'Esencias botánicas', 'Hierbas secas'],
    ritualUse: 'Úsala en un lugar ventilado, con una intención escrita y supervisión constante.',
    isFeatured: true,
    soldCount: 28,
  },
  {
    name: 'Baño Espiritual de Limpieza',
    categorySlug: 'limpieza-y-descarga',
    intention: 'Limpieza energética',
    price: 26000,
    compareAtPrice: 0,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Hierbas para una práctica simbólica de descarga.',
    description: 'Mezcla botánica para acompañar rituales de renovación, descarga y cierre de ciclos.',
    ingredients: ['Ruda', 'Romero', 'Albahaca', 'Sales'],
    ritualUse: 'Infusiona las hierbas, deja reposar y úsalo como baño externo después de tu aseo habitual.',
    isFeatured: false,
    soldCount: 19,
  },
  {
    name: 'Aceite Esotérico de Amor',
    categorySlug: 'amor-y-atraccion',
    intention: 'Amor',
    price: 39000,
    compareAtPrice: 46000,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1608571423902-abb9a7607f0f?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Aceite aromático para intención afectiva y autoestima.',
    description: 'Aceite ritual de uso simbólico para prácticas enfocadas en amor propio, armonía y atracción consciente.',
    ingredients: ['Aceite vegetal', 'Rosas', 'Canela', 'Esencia aromática'],
    ritualUse: 'Aplica una pequeña cantidad en una vela o amuleto. No ingerir.',
    isFeatured: true,
    soldCount: 41,
  },
  {
    name: 'Amuleto de Protección',
    categorySlug: 'proteccion-espiritual',
    intention: 'Protección',
    price: 45000,
    compareAtPrice: 0,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Talismán simbólico para cuidado espiritual cotidiano.',
    description: 'Amuleto seleccionado para acompañar prácticas personales de protección, enfoque y calma interior.',
    ingredients: ['Mineral natural', 'Cordón ajustable', 'Bolsa ritual'],
    ritualUse: 'Límpialo con humo de incienso y conságralo con una intención breve antes de usarlo.',
    isFeatured: false,
    soldCount: 15,
  },
  {
    name: 'Sahumerio de Prosperidad',
    categorySlug: 'dinero-y-prosperidad',
    intention: 'Prosperidad',
    price: 22000,
    compareAtPrice: 0,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=900&q=80',
    shortDescription: 'Aroma ceremonial para intencionar abundancia.',
    description: 'Sahumerio para preparar espacios de trabajo, rituales de gratitud y prácticas de claridad financiera.',
    ingredients: ['Resinas', 'Hierbas aromáticas', 'Maderas'],
    ritualUse: 'Enciende la punta, apaga la llama y deja que el humo recorra el espacio con ventilación.',
    isFeatured: true,
    soldCount: 23,
  },
].map((product, index) => {
  const category = categories.find((item) => item.slug === product.categorySlug);
  return {
    _id: `prod-${index + 1}`,
    slug: toSlug(product.name),
    sku: `BEI-${String(index + 1).padStart(3, '0')}`,
    tags: [product.intention, category?.name || 'Ritual'],
    images: [product.image],
    mainImage: product.image,
    category: category?._id,
    categoryName: category?.name || '',
    warnings: 'Este producto es de uso espiritual, ritual y simbólico. No sustituye tratamiento médico, psicológico, legal o financiero profesional.',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...product,
  };
});

const orders = [];

function listProducts(query = {}) {
  let result = products.filter((product) => product.isActive);
  if (query.category) result = result.filter((product) => product.categorySlug === query.category);
  if (query.intention) result = result.filter((product) => product.intention.toLowerCase().includes(query.intention.toLowerCase()));
  if (query.search) {
    const term = query.search.toLowerCase();
    result = result.filter((product) => `${product.name} ${product.description} ${product.intention}`.toLowerCase().includes(term));
  }
  if (query.featured === 'true') result = result.filter((product) => product.isFeatured);
  if (query.sort === 'price_asc') result.sort((a, b) => a.price - b.price);
  if (query.sort === 'price_desc') result.sort((a, b) => b.price - a.price);
  if (query.sort === 'best_seller') result.sort((a, b) => b.soldCount - a.soldCount);
  return result;
}

function createProduct(payload) {
  const category = categories.find((item) => item.slug === payload.categorySlug || item._id === payload.category);
  const product = {
    _id: `prod-${Date.now()}`,
    slug: toSlug(payload.name),
    images: payload.images?.length ? payload.images : [payload.mainImage].filter(Boolean),
    mainImage: payload.mainImage || payload.images?.[0] || '',
    category: category?._id,
    categoryName: category?.name || payload.categoryName || '',
    categorySlug: category?.slug || payload.categorySlug || '',
    tags: payload.tags || [],
    ingredients: payload.ingredients || [],
    warnings: payload.warnings || 'Producto de uso espiritual, ritual y simbólico.',
    isActive: payload.isActive ?? true,
    isFeatured: payload.isFeatured ?? false,
    soldCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...payload,
  };
  products.unshift(product);
  return product;
}

function updateProduct(id, payload) {
  const index = products.findIndex((product) => product._id === id);
  if (index === -1) return null;
  const category = categories.find((item) => item.slug === payload.categorySlug || item._id === payload.category);
  products[index] = {
    ...products[index],
    ...payload,
    slug: payload.name ? toSlug(payload.name) : products[index].slug,
    category: category?._id || products[index].category,
    categoryName: category?.name || payload.categoryName || products[index].categoryName,
    categorySlug: category?.slug || payload.categorySlug || products[index].categorySlug,
    updatedAt: new Date(),
  };
  return products[index];
}

function createOrder(payload) {
  const items = payload.items.map((item) => {
    const product = products.find((candidate) => candidate._id === item.product || candidate.slug === item.slug);
    if (!product || !product.isActive) throw new Error(`Producto no disponible: ${item.product}`);
    return {
      product: product._id,
      name: product.name,
      quantity: Number(item.quantity || 1),
      price: Number(product.price),
      image: product.mainImage || '',
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    _id: `order-${Date.now()}`,
    orderNumber: createOrderNumber(),
    idempotencyKey: payload.idempotencyKey,
    customer: payload.customer,
    items,
    subtotal,
    shippingCost: Number(payload.shippingCost || 0),
    total: subtotal + Number(payload.shippingCost || 0),
    paymentMethod: payload.paymentMethod,
    paymentStatus: 'Pendiente',
    orderStatus: 'Nuevo',
    shippingStatus: 'Pendiente de despacho',
    adminNotes: '',
    inventoryRestored: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  items.forEach((item) => {
    const product = products.find((candidate) => candidate._id === item.product);
    if (product) product.stock = Math.max(0, product.stock - item.quantity);
  });
  orders.unshift(order);
  return order;
}

module.exports = {
  categories,
  products,
  orders,
  listProducts,
  createProduct,
  updateProduct,
  createOrder,
};

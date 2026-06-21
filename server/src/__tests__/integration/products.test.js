const request = require('supertest');
const app = require('../../app');

describe('GET /api/products', () => {
  it('returns 200 with a list of items', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('includes pagination metadata', async () => {
    const res = await request(app).get('/api/products');
    expect(res.body.pagination).toMatchObject({
      page: 1,
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  it('returns products with required fields', async () => {
    const res = await request(app).get('/api/products');
    const product = res.body.items[0];
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('slug');
  });

  it('filters by category slug', async () => {
    const res = await request(app).get('/api/products?category=dinero-y-prosperidad');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('returns 400 for invalid sort value', async () => {
    const res = await request(app).get('/api/products?sort=invalid_sort');
    expect(res.status).toBe(400);
  });

  it('paginates correctly', async () => {
    const page1 = await request(app).get('/api/products?page=1&limit=2');
    expect(page1.status).toBe(200);
    expect(page1.body.items.length).toBeLessThanOrEqual(2);
    expect(page1.body.pagination.limit).toBe(2);
  });

  it('returns facets with intentions', async () => {
    const res = await request(app).get('/api/products');
    expect(res.body.facets).toHaveProperty('intentions');
    expect(Array.isArray(res.body.facets.intentions)).toBe(true);
  });
});

describe('GET /api/products/featured', () => {
  it('returns featured products as an array', async () => {
    const res = await request(app).get('/api/products/featured');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns at most 8 featured products', async () => {
    const res = await request(app).get('/api/products/featured');
    expect(res.body.length).toBeLessThanOrEqual(8);
  });
});

describe('GET /api/products/:slug', () => {
  let firstSlug;

  beforeAll(async () => {
    const res = await request(app).get('/api/products');
    firstSlug = res.body.items[0]?.slug;
  });

  it('returns a single product by slug', async () => {
    const res = await request(app).get(`/api/products/${firstSlug}`);
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe(firstSlug);
  });

  it('returns 404 for a non-existent slug', async () => {
    const res = await request(app).get('/api/products/this-does-not-exist-xyz');
    expect(res.status).toBe(404);
  });

  it('returns 400 for a slug with invalid characters', async () => {
    const res = await request(app).get('/api/products/bad%00slug');
    expect([400, 404, 422]).toContain(res.status);
  });
});

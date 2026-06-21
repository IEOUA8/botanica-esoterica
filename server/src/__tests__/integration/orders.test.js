const request = require('supertest');
const { randomUUID: uuid } = require('crypto');
const app = require('../../app');

const validCustomer = {
  fullName: 'Ana García',
  phone: '3001234567',
  email: 'ana@test.com',
  city: 'Bogotá',
  address: 'Calle 100 # 15-20 Apto 301',
};

async function getFirstProduct() {
  const res = await request(app).get('/api/products');
  return res.body.items[0];
}

describe('POST /api/orders', () => {
  let product;

  beforeAll(async () => {
    product = await getFirstProduct();
  });

  it('creates an order and returns 201 with order details', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Idempotency-Key', uuid())
      .send({
        customer: validCustomer,
        items: [{ product: product._id, quantity: 1 }],
        paymentMethod: 'Transferencia bancaria',
      });

    expect(res.status).toBe(201);
    expect(res.body.order).toMatchObject({
      orderNumber: expect.stringMatching(/^BEI-/),
      customer: expect.objectContaining({ fullName: validCustomer.fullName }),
      total: expect.any(Number),
    });
  });

  it('returns a WhatsApp message in the response', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Idempotency-Key', uuid())
      .send({
        customer: validCustomer,
        items: [{ product: product._id, quantity: 1 }],
        paymentMethod: 'Nequi',
      });

    expect(res.status).toBe(201);
    expect(typeof res.body.whatsappMessage).toBe('string');
    expect(res.body.whatsappMessage).toContain(validCustomer.fullName);
  });

  it('is idempotent — same key returns 200 with same order', async () => {
    const key = uuid();
    const payload = {
      customer: validCustomer,
      items: [{ product: product._id, quantity: 1 }],
      paymentMethod: 'Daviplata',
    };

    const first = await request(app).post('/api/orders').set('Idempotency-Key', key).send(payload);
    const second = await request(app).post('/api/orders').set('Idempotency-Key', key).send(payload);

    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    expect(second.body.idempotentReplay).toBe(true);
    expect(second.body.order.orderNumber).toBe(first.body.order.orderNumber);
  });

  it('returns 400 when Idempotency-Key is missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customer: validCustomer,
        items: [{ product: product._id, quantity: 1 }],
        paymentMethod: 'Nequi',
      });
    expect(res.status).toBe(400);
  });

  it('returns 400 when Idempotency-Key is not a UUID', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Idempotency-Key', 'not-a-uuid')
      .send({
        customer: validCustomer,
        items: [{ product: product._id, quantity: 1 }],
        paymentMethod: 'Nequi',
      });
    expect(res.status).toBe(400);
  });

  it('returns 400 when customer data is missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Idempotency-Key', uuid())
      .send({ items: [{ product: product._id, quantity: 1 }], paymentMethod: 'Nequi' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when items array is empty', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Idempotency-Key', uuid())
      .send({ customer: validCustomer, items: [], paymentMethod: 'Nequi' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid payment method', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Idempotency-Key', uuid())
      .send({
        customer: validCustomer,
        items: [{ product: product._id, quantity: 1 }],
        paymentMethod: 'Tarjeta de crédito',
      });
    expect(res.status).toBe(400);
  });

  it('returns 400 when product is not available', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Idempotency-Key', uuid())
      .send({
        customer: validCustomer,
        items: [{ product: 'non-existent-product-id', quantity: 1 }],
        paymentMethod: 'Nequi',
      });
    expect([400]).toContain(res.status);
  });
});

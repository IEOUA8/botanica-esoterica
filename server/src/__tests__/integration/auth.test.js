const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');

const VALID_EMAIL = process.env.ADMIN_EMAIL;
const VALID_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

describe('POST /api/auth/login', () => {
  it('returns 200 with token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_EMAIL, password: VALID_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.admin).toMatchObject({ email: VALID_EMAIL });
  });

  it('returns a valid JWT signed with the app secret', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_EMAIL, password: VALID_PASSWORD });

    const decoded = jwt.verify(res.body.token, JWT_SECRET, { algorithms: ['HS256'] });
    expect(decoded.email).toBe(VALID_EMAIL);
    expect(decoded.role).toBeTruthy();
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_EMAIL, password: 'WrongPassword123' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/inv/i);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@unknown.com', password: VALID_PASSWORD });

    expect(res.status).toBe(401);
  });

  it('returns 400 when email is not an email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: VALID_PASSWORD });

    expect(res.status).toBe(400);
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_EMAIL, password: 'short' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_EMAIL, password: VALID_PASSWORD });
    token = res.body.token;
  });

  it('returns admin data with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.admin).toMatchObject({ email: VALID_EMAIL });
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 with malformed token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer bad.token.value');
    expect(res.status).toBe(401);
  });
});

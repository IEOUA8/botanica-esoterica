const request = require('supertest');
const app = require('../../app');

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.app).toBeTruthy();
  });

  it('reports demo database in demo mode', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.database).toBe('demo');
  });
});

describe('Unknown route', () => {
  it('returns 404 for unmatched paths', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.message).toBeTruthy();
  });
});

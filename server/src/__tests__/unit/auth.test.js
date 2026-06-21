const jwt = require('jsonwebtoken');

const TEST_SECRET = process.env.JWT_SECRET;

describe('JWT token generation and verification', () => {
  function signAdmin(admin, secret = TEST_SECRET) {
    return jwt.sign(
      { id: admin._id || 'demo-admin', email: admin.email, name: admin.name, role: admin.role || 'admin' },
      secret,
      { expiresIn: '7d' }
    );
  }

  it('creates a verifiable token', () => {
    const token = signAdmin({ email: 'test@test.com', name: 'Test Admin' });
    const decoded = jwt.verify(token, TEST_SECRET, { algorithms: ['HS256'] });
    expect(decoded.email).toBe('test@test.com');
    expect(decoded.name).toBe('Test Admin');
    expect(decoded.role).toBe('admin');
  });

  it('includes id, email, name, role in payload', () => {
    const token = signAdmin({ _id: 'abc123', email: 'a@b.com', name: 'Admin', role: 'superadmin' });
    const decoded = jwt.decode(token);
    expect(decoded.id).toBe('abc123');
    expect(decoded.role).toBe('superadmin');
  });

  it('defaults role to admin when not provided', () => {
    const token = signAdmin({ email: 'x@y.com', name: 'X' });
    const decoded = jwt.decode(token);
    expect(decoded.role).toBe('admin');
  });

  it('defaults id to demo-admin when _id is missing', () => {
    const token = signAdmin({ email: 'x@y.com', name: 'X' });
    const decoded = jwt.decode(token);
    expect(decoded.id).toBe('demo-admin');
  });

  it('rejects a token signed with a different secret', () => {
    const token = signAdmin({ email: 'x@y.com', name: 'X' }, 'wrong-secret-with-enough-length-here');
    expect(() => jwt.verify(token, TEST_SECRET, { algorithms: ['HS256'] })).toThrow();
  });

  it('rejects an expired token', () => {
    const token = jwt.sign({ id: 'x', email: 'x@y.com', name: 'X', role: 'admin' }, TEST_SECRET, { expiresIn: '0s' });
    expect(() => jwt.verify(token, TEST_SECRET, { algorithms: ['HS256'] })).toThrow(/expired/i);
  });
});

describe('requireAuth middleware', () => {
  const { requireAuth } = require('../../middleware/auth');

  function makeReqRes(token) {
    const req = { headers: { authorization: token ? `Bearer ${token}` : '' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return { req, res };
  }

  it('calls next with a valid token', () => {
    const token = jwt.sign({ id: '1', email: 'a@b.com', name: 'A', role: 'admin' }, TEST_SECRET, { expiresIn: '1h' });
    const { req, res } = makeReqRes(token);
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ email: 'a@b.com' });
  });

  it('returns 401 when no token provided', () => {
    const { req, res } = makeReqRes(null);
    requireAuth(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 when token is invalid', () => {
    const { req, res } = makeReqRes('bad.token.here');
    requireAuth(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

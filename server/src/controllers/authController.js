const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { dbReady } = require('../config/db');
const env = require('../config/env');

function signAdmin(admin) {
  return jwt.sign(
    { id: admin._id || 'demo-admin', email: admin.email, name: admin.name, role: admin.role || 'admin' },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

async function ensureSeedAdmin() {
  if (!dbReady()) return null;
  const email = env.adminEmail;
  const existing = await AdminUser.findOne({ email });
  if (existing) return existing;
  const password = await bcrypt.hash(env.adminPassword, 12);
  return AdminUser.create({
    name: env.adminName,
    email,
    password,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const adminEmail = env.adminEmail;
  const adminPassword = env.adminPassword;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
  }

  if (dbReady()) {
    const admin = await AdminUser.findOne({ email: email.toLowerCase(), isActive: true });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const token = signAdmin(admin);
    return res.json({ token, admin: { name: admin.name, email: admin.email, role: admin.role } });
  }

  if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const demoAdmin = { name: env.adminName, email: adminEmail, role: 'admin' };
  return res.json({ token: signAdmin(demoAdmin), admin: demoAdmin });
}

function me(req, res) {
  return res.json({ admin: req.user });
}

function logout(req, res) {
  return res.json({ message: 'Sesión cerrada.' });
}

module.exports = { ensureSeedAdmin, login, me, logout };

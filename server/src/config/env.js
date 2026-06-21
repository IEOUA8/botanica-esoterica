const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const demoMode = process.env.DEMO_MODE === 'true';
const errors = [];

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) errors.push(`${name} es obligatoria.`);
  return value || '';
}

const jwtSecret = required('JWT_SECRET');
const adminEmail = required('ADMIN_EMAIL');
const adminPassword = required('ADMIN_PASSWORD');
const mongoUri = process.env.MONGO_URI?.trim() || '';
const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const port = Number(process.env.PORT || 5001);
const trustProxy = process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) : false;
const seedDemoData = process.env.SEED_DEMO_DATA === 'true';
const shippingFlatRate = Number(process.env.SHIPPING_FLAT_RATE || 0);
const freeShippingThreshold = Number(process.env.FREE_SHIPPING_THRESHOLD || 0);

if (!Number.isInteger(port) || port < 1 || port > 65535) errors.push('PORT debe ser un puerto válido.');
if (trustProxy !== false && (!Number.isInteger(trustProxy) || trustProxy < 1 || trustProxy > 10)) {
  errors.push('TRUST_PROXY debe ser un número entre 1 y 10.');
}
if (jwtSecret && jwtSecret.length < 32) errors.push('JWT_SECRET debe tener al menos 32 caracteres.');
if (adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) errors.push('ADMIN_EMAIL no es válido.');
if (isProduction && adminPassword.length < 12) errors.push('ADMIN_PASSWORD debe tener al menos 12 caracteres en producción.');
if (!mongoUri && !demoMode) errors.push('Configura MONGO_URI o activa DEMO_MODE=true explícitamente.');
if (isProduction && demoMode) errors.push('DEMO_MODE no puede estar activo en producción.');
if (isProduction && seedDemoData) errors.push('SEED_DEMO_DATA no puede estar activo en producción.');
if (!Number.isFinite(shippingFlatRate) || shippingFlatRate < 0) errors.push('SHIPPING_FLAT_RATE debe ser un número positivo.');
if (!Number.isFinite(freeShippingThreshold) || freeShippingThreshold < 0) errors.push('FREE_SHIPPING_THRESHOLD debe ser un número positivo.');

for (const origin of clientOrigins) {
  try {
    new URL(origin);
  } catch {
    errors.push(`CLIENT_URL contiene un origen inválido: ${origin}`);
  }
}

if (errors.length) {
  throw new Error(`Configuración inválida:\n- ${errors.join('\n- ')}`);
}

module.exports = Object.freeze({
  nodeEnv,
  isProduction,
  demoMode,
  seedDemoData,
  port,
  trustProxy,
  mongoUri,
  shippingFlatRate,
  freeShippingThreshold,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigins,
  adminEmail: adminEmail.toLowerCase(),
  adminPassword,
  adminName: process.env.ADMIN_NAME?.trim() || 'Administrador',
});

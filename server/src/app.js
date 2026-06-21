const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimits');
const { dbReady } = require('./config/db');

const app = express();

app.disable('x-powered-by');
if (env.trustProxy !== false) app.set('trust proxy', env.trustProxy);
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) return callback(null, true);
      const error = new Error('Origen no permitido por CORS.');
      error.status = 403;
      return callback(error);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Botánica Esotérica Internacional',
    database: env.demoMode ? 'demo' : dbReady() ? 'connected' : 'unavailable',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status || 500;
  const message = status < 500 || !env.isProduction ? error.message : 'Error interno del servidor.';
  res.status(status).json({ message: message || 'Error interno del servidor.' });
});

module.exports = app;

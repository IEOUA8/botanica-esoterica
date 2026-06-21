const env = require('./config/env');
const app = require('./app');
const { connectDB } = require('./config/db');
const { ensureSeedAdmin } = require('./controllers/authController');
const { ensureSeedData } = require('./services/seedDatabase');

async function start() {
  await connectDB();
  await ensureSeedData();
  await ensureSeedAdmin();
  app.listen(env.port, () => {
    console.log(`API lista en http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error);
  process.exit(1);
});

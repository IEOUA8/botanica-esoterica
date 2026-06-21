const mongoose = require('mongoose');
const env = require('./env');

let isDatabaseReady = false;

async function connectDB() {
  if (env.demoMode) {
    console.log('DEMO_MODE activo. Usando datos demo en memoria.');
    return false;
  }

  try {
    await mongoose.connect(env.mongoUri);
    isDatabaseReady = true;
    console.log('MongoDB conectado.');
    return true;
  } catch (error) {
    isDatabaseReady = false;
    throw new Error(`No se pudo conectar a MongoDB: ${error.message}`);
  }
}

function dbReady() {
  return isDatabaseReady && mongoose.connection.readyState === 1;
}

module.exports = { connectDB, dbReady };

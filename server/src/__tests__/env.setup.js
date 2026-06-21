// Sets required env vars before dotenv loads (dotenv won't override already-set vars).
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jest-minimum-32-characters-ok';
process.env.ADMIN_EMAIL = 'admin@test.com';
process.env.ADMIN_PASSWORD = 'TestPassword123';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.PORT = '5001';
process.env.DEMO_MODE = 'true';
process.env.SEED_DEMO_DATA = 'false';
process.env.SHIPPING_FLAT_RATE = '0';
process.env.FREE_SHIPPING_THRESHOLD = '0';

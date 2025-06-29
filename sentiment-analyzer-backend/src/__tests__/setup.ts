import mongoose from 'mongoose';

// Test database configuration
const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB_TEST_DATABASE_NAME = process.env.MONGO_DB_TEST_DATABASE_NAME || 'sentiment_analyzer_test';
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';

  // Close any existing connections first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  // Connect to test database
  await mongoose.connect(`${TEST_MONGO_URI}/${MONGO_DB_TEST_DATABASE_NAME}`);
});

afterAll(async () => {
  // Close database connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

afterEach(async () => {
  // Clean up database after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}); 
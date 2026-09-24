import mongoose from 'mongoose';
import { config } from './config.js';
import { createApp } from './app.js';

// Treat user input as plain values, never as MongoDB operators like {"$gt": ""}
mongoose.set('sanitizeFilter', true);

try {
  await mongoose.connect(config.mongoUri, { dbName: config.dbName });
  console.log(`Connected to MongoDB database "${config.dbName}"`);
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}

createApp().listen(config.port, () => {
  console.log(`API ready on http://localhost:${config.port}`);
});

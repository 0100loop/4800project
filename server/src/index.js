import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/4800project'; // 127.0.0.1 avoids IPv6 issues

async function start() {
  // Try DB, but don't crash if it fails
  try {
    await mongoose.connect(MONGO_URI, { dbName: '4800project' });
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('⚠️ MongoDB not connected. Continuing without DB for now.\n', err?.message || err);
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start();


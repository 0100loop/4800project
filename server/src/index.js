import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/4800project';

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: '4800project' });
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('⚠️ MongoDB not connected. Continuing without DB for now.\n', err?.message || err);
  }
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}
start();

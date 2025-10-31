import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { configDotenv } from 'dotenv';

configDotenv();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('⚠️ MongoDB not connected. Continuing without DB for now.');
    console.error(error.message);
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start();


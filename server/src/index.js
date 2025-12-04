// index.js
import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import express from 'express';
import app from './app.js';
import Spot from './models/Spot.js';

// If you want to serve frontend from the same Express server:
const FRONTEND_PATH = path.join(process.cwd(), '../client/build'); // adjust if using Vite (dist instead of build)
app.use(express.static(FRONTEND_PATH));
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Optional: ensure indexes
    await Spot.syncIndexes();
    console.log('✅ Spot indexes synced');
  } catch (err) {
    console.error('⚠️ MongoDB connection failed. Server will continue without DB.');
    console.error(err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();

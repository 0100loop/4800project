// server.js
import 'dotenv/config'; // automatically loads .env
import mongoose from 'mongoose';
import app from './app.js';
import Spot from './models/Spot.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Optional: ensure indexes on Spot model
    await Spot.syncIndexes();
    console.log('✅ Spot indexes synced');

  } catch (err) {
    console.error('⚠️ MongoDB connection failed. Server will continue without DB.');
    console.error(err.message);
  }

  // Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();

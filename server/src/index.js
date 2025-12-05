import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import Spot from './models/Spot.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Spot.syncIndexes();
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

// server/src/index.js
import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import Spot from './models/Spot.js';
import path from "path";
import express from "express";  
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    await Spot.syncIndexes();
    console.log('✅ Spot indexes synced');

  } catch (err) {
    console.error('⚠️ MongoDB connection failed. Server will continue without DB.');
    console.error(err.message);
  }

  // -------------------- SERVE REACT BUILD --------------------
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const clientBuildPath = path.join(__dirname, "../../client/build");

  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
  // -----------------------------------------------------------

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();

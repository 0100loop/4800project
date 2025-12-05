<<<<<<< HEAD
// server/src/index.js
=======
// index.js
>>>>>>> 3c877de6e3796540b969b0727658975cf75f97dc
import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import express from 'express';
import app from './app.js';
import Spot from './models/Spot.js';
import path from "path";
import { fileURLToPath } from "url";

// If you want to serve frontend from the same Express server:
const FRONTEND_PATH = path.join(process.cwd(), '../client/build'); // adjust if using Vite (dist instead of build)
app.use(express.static(FRONTEND_PATH));
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

<<<<<<< HEAD
=======
    // Optional: ensure indexes
>>>>>>> 3c877de6e3796540b969b0727658975cf75f97dc
    await Spot.syncIndexes();
    console.log('✅ Spot indexes synced');
  } catch (err) {
    console.error('⚠️ MongoDB connection failed. Server will continue without DB.');
    console.error(err.message);
  }

<<<<<<< HEAD
  // -------------------- SERVE REACT BUILD --------------------
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const clientBuildPath = path.join(__dirname, "../../client/build");

  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
  // -----------------------------------------------------------

=======
>>>>>>> 3c877de6e3796540b969b0727658975cf75f97dc
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();

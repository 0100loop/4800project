import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const mongoStatus =
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.status(200).json({
      status: 'ok',
      message: 'Server is running properly!',
      mongoDB: mongoStatus,
      time: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error in /api/health:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;

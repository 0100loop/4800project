import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { spotId, start, end } = req.body || {};
    if (!spotId || !start || !end) {
      return res.status(400).json({ error: 'spotId, start, end are required' });
    }
    // Demo only: in a real app you would persist a Reservation model
    res.status(201).json({
      ok: true,
      message: 'Reservation created (demo)',
      reservation: { spotId, userId: req.user.id, start, end, status: 'confirmed' }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

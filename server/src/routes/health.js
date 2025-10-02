import { Router } from 'express';
const router = Router();

// Return acceptance-criteria shape:
router.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

export default router;

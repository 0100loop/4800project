import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import spotsRouter from './routes/spots.js';   // <— add this

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));

app.use('/api/health', healthRouter);
app.use('/api/spots', spotsRouter);           // <— and this

export default app;

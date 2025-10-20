import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import listingsRouter from './routes/listings.js';
import eventsRouter from './routes/events.js';
import spotsRouter from './routes/spots.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: (process.env.CORS_ORIGIN?.split(',') || ['*']), credentials: true }));

app.use('/api/health', healthRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/spots', spotsRouter);

export default app;

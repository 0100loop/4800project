import express from 'express';
import cors from 'cors';

import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import bookingsRouter from './routes/bookings.js';
import eventsRouter from './routes/events.js';
import spotsRouter from './routes/spots.js';
import webhookRouter from "./routes/webhooks.js";
import paymentsRouter from "./routes/payments.js";


const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/spots', spotsRouter);
app.use("/api/webhooks", webhookRouter);
app.use("/api/payments", paymentsRouter);

export default app;

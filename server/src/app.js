import express from "express";
import cors from "cors";

import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import listingsRouter from "./routes/listings.js";
import bookingsRouter from "./routes/bookings.js";
import eventsRouter from "./routes/events.js";
import spotsRouter from "./routes/spots.js";

const app = express();
app.use(express.json());

// FIXED CORS 🔥🔥🔥
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/spots", spotsRouter);

export default app;

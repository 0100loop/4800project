import express from "express";
import eventsRouter from "./events.js";
import authRouter from "./auth.js";
import bookingsRouter from "./bookings.js";
import listingsRouter from "./listings.js";
import spotsRouter from "./spots.js";
import paymentsRouter from "./payments.js";
import seatGeekRouter from "./seatgeek.js";
import forgotPasswordRouter from "./forgotPassword.js";
import resetPasswordRouter from "./resetPassword.js";
import healthRouter from "./health.js";

const router = express.Router();

router.use("/events", eventsRouter);
router.use("/auth", authRouter);
router.use("/bookings", bookingsRouter);
router.use("/listings", listingsRouter);
router.use("/spots", spotsRouter);
router.use("/payments", paymentsRouter);
router.use("/seatgeek", seatGeekRouter);
router.use("/forgot-password", forgotPasswordRouter);
router.use("/reset-password", resetPasswordRouter);
router.use("/health", healthRouter);

// Fallback
router.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default router;


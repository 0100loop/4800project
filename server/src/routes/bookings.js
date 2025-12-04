import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

/* =============================================
   GET ALL BOOKINGS (Public)
============================================= */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("spot").lean();
    res.json(bookings);
  } catch (err) {
    console.error("Bookings Error:", err);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

/* =============================================
   HOST BOOKINGS (Public)
============================================= */
router.get("/host", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("spot")
      .populate("user", "name");

    res.json(bookings);
  } catch (err) {
    console.error("Host Booking Error:", err);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

export default router;

import express from "express";
import auth from "../middleware/auth.js";
import Booking from "../models/Booking.js";

const router = express.Router();

/* ======================================================
    CREATE BOOKING (event-based bookings)
====================================================== */
router.post("/", auth("user"), async (req, res) => {
  try {
    const { eventName, eventDate, eventVenue, totalPrice } = req.body;

    if (!eventName || !eventDate || !eventVenue) {
      return res.status(400).json({ error: "Missing booking fields" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      eventName,
      eventDate,
      eventVenue,
      totalPrice,
      createdAt: new Date(),
    });

    res.json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
    GET MY BOOKINGS (USER ONLY)
====================================================== */
router.get("/", auth("user"), async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ eventDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Load bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
    HOST VIEW BOOKINGS FOR A SPOT (optional)
====================================================== */
router.get("/spot/:spotId", auth("user"), async (req, res) => {
  try {
    const { spotId } = req.params;

    const bookings = await Booking.find({ spotId })
      .sort({ eventDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Host spot bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;



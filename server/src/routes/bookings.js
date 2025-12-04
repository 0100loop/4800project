import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Spot from "../models/Spot.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// CREATE BOOKING (Spot-based)
router.post("/", auth(), async (req, res) => {
  try {
    console.log("Incoming booking body:", req.body);

    const { spotId, email, phone, totalPrice, date } = req.body;

    if (!spotId) {
      return res.status(400).json({ error: "Missing spotId" });
    }

    const spot = await Spot.findById(spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }

    // Create booking (not paid yet)
    const booking = await Booking.create({
      userId: req.user.id,
      spotId: new mongoose.Types.ObjectId(spotId),
      email,
      phone,
      totalPrice,
      date: date || new Date(),
      status: "pending",
      paid: false,
    });

    console.log("Created new booking:", booking._id);
    return res.status(201).json(booking);

  } catch (e) {
    console.error("Booking creation error:", e);
    res.status(500).json({ error: e.message });
  }
});

// GET BOOKINGS
router.get("/", auth(), async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("spotId") // ⬅ get address, price, etc.
      .sort({ date: -1 });

    res.json(bookings);
  } catch (e) {
    console.error("Error fetching bookings:", e);
    res.status(500).json({ error: e.message });
  }
});


export default router;

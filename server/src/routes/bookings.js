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
    console.log("User from auth:", req.user);

    const { spotId, email, phone, totalPrice, date } = req.body;

    if (!spotId) {
      console.error("Missing spotId in request");
      return res.status(400).json({ error: "Missing spotId" });
    }

    // Validate spotId format
    if (!mongoose.Types.ObjectId.isValid(spotId)) {
      console.error("Invalid spotId format:", spotId);
      return res.status(400).json({ error: "Invalid spotId format" });
    }

    const spot = await Spot.findById(spotId);
    if (!spot) {
      console.error("Spot not found:", spotId);
      return res.status(404).json({ error: "Spot not found" });
    }

    console.log("Found spot:", spot._id);

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
    console.log("Booking object:", JSON.stringify(booking, null, 2));

    // CRITICAL: Always return JSON
    return res.status(201).json({
      success: true,
      booking: {
        _id: booking._id,
        userId: booking.userId,
        spotId: booking.spotId,
        email: booking.email,
        phone: booking.phone,
        totalPrice: booking.totalPrice,
        date: booking.date,
        status: booking.status,
        paid: booking.paid,
      }
    });

  } catch (e) {
    console.error("Booking creation error:", e);
    console.error("Error stack:", e.stack);
    
    // Always return JSON, even on error
    return res.status(500).json({ 
      error: e.message || "Failed to create booking",
      details: e.toString()
    });
  }
});

// GET BOOKINGS
router.get("/", auth(), async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("spotId")
      .sort({ date: -1 });

    return res.json({ success: true, bookings });
  } catch (e) {
    console.error("Error fetching bookings:", e);
    return res.status(500).json({ 
      error: e.message || "Failed to fetch bookings" 
    });
  }
});

export default router;
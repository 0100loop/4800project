import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ============================
       CREATE BOOKING
============================ */
router.post("/", auth("user"), async (req, res) => {
  try {
    const {
      listingId,
      spotId,
      start,
      end,
      email,
      phone,
      vehicleInfo,
      total,
      date,
    } = req.body;

    console.log("Booking request:", req.body);

    // NEW FORMAT — VIA Booking Confirmation
    if (listingId) {
      const listing = await Listing.findById(listingId);
      if (!listing)
        return res.status(404).json({ error: "Listing not found" });

      const booking = await Booking.create({
        userId: req.user.id,
        listingId,
        spotId: listing.spotId,
        email,
        phone,
        vehicleInfo,
        totalPrice: total,
        date: date ? new Date(date) : new Date(),
        status: "confirmed",
        paymentId: "PAY_" + Date.now(),
      });

      await Listing.findByIdAndUpdate(listingId, { booked: true });

      return res.json({ message: "Booking confirmed", booking });
    }

    /* OLD FORMAT SUPPORT */
    const listing = await Listing.findById(spotId);
    if (!listing)
      return res.status(404).json({ error: "Listing not found" });

    const hours = Math.max(1, (new Date(end) - new Date(start)) / 3600000);
    const totalPrice = Math.round(hours * (listing.pricePerHour || 10));

    const booking = await Booking.create({
      userId: req.user.id,
      listingId: listing._id,
      start,
      end,
      totalPrice,
      status: "paid",
      paymentId: "PAY_" + Date.now(),
    });

    res.json({ message: "Booking confirmed", booking });
  } catch (e) {
    console.error("Booking error:", e);
    res.status(400).json({ error: e.message });
  }
});

/* ============================
    GET BOOKINGS (HOST / USER)
============================ */
router.get("/", auth("user"), async (req, res) => {
  try {
    const { spotId, upcoming } = req.query;

    // HOST VIEWING BOOKINGS BY SPOT
    if (spotId) {
      const query = { spotId: new mongoose.Types.ObjectId(spotId) };

      if (upcoming === "true") {
        query.date = { $gte: new Date() };
      }

      const bookings = await Booking.find(query).sort({ date: 1 });
      return res.json(bookings);
    }

    // USER VIEWING OWN BOOKINGS
    const bookings = await Booking.find({ userId: req.user.id }).sort({
      date: -1,
    });

    res.json(bookings);
  } catch (e) {
    console.error("Error fetching bookings:", e);
    res.status(500).json({ error: e.message });
  }
});

/* ============================
     GET /me — USER BOOKINGS
============================ */
router.get("/me", auth("user"), async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("listingId")
      .sort({ date: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error in /me:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;



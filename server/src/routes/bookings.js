import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create booking
router.post("/", auth("user"), async (req, res) => {
  try {
    const { listingId, spotId, start, end, email, phone, vehicleInfo, total, date } = req.body;
    
    console.log('Booking request:', req.body);

    // Handle both old format (spotId, start, end) and new format (listingId, date, total)
    if (listingId) {
      // New format from BookingConfirmation
      const listing = await Listing.findById(listingId);
      if (!listing) return res.status(404).json({ error: "Listing not found" });

      const booking = await Booking.create({
        userId: req.user.id,
        listingId: new mongoose.Types.ObjectId(listingId),
        spotId: listing.spotId, // Get spotId from listing
        email,
        phone,
        vehicleInfo,
        totalPrice: total,
        date: date || new Date(),
        status: "confirmed",
        paymentId: "PAY_" + Date.now(), // Mock payment
      });

      await Listing.findByIdAndUpdate(listingId, { booked: true });
      return res.json({ message: "Booking confirmed", booking });
    }

    // Old format (legacy support)
    const listing = await Listing.findById(spotId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const hours = Math.max(1, (new Date(end) - new Date(start)) / 3600000);
    const totalPrice = Math.round(hours * (listing.pricePerHour || 10));
    const paymentId = "PAY_" + Date.now();

    const booking = await Booking.create({
      userId: req.user.id,
      listingId: listing._id,
      start,
      end,
      totalPrice,
      status: "paid",
      paymentId,
    });
    
    res.json({ message: "Booking confirmed", booking });
  } catch (e) {
    console.error('Booking error:', e);
    res.status(400).json({ error: e.message });
  }
});

// Get bookings - for hosts (by spotId) or guests (by userId)
router.get("/", auth("user"), async (req, res) => {
  try {
    const { spotId, upcoming } = req.query;

    if (spotId) {
      // Host viewing bookings for their spot
      const query = { spotId: new mongoose.Types.ObjectId(spotId) };
      
      if (upcoming === 'true') {
        query.date = { $gte: new Date() };
      }

      const bookings = await Booking.find(query).sort({ date: 1 });
      return res.json(bookings);
    }

    // Guest viewing their own bookings
    const bookings = await Booking.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(bookings);
  } catch (e) {
    console.error('Error fetching bookings:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
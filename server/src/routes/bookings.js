import express from "express";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ============================
   CREATE A BOOKING (USER)
   POST /api/bookings
============================ */
router.post("/", auth("user"), async (req, res) => {
  try {
    const { spotId, start, end } = req.body;

    const listing = await Listing.findById(spotId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    // Calculate number of hours
    const hours = Math.max(1, (new Date(end) - new Date(start)) / 3600000);

    const totalPrice = Math.round(hours * (listing.pricePerHour || 10));

    // Simulated payment result
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
    res.status(400).json({ error: e.message });
  }
});

/* ============================
   GET USER BOOKINGS
   GET /api/bookings
============================ */
router.get("/", auth("user"), async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("listingId")
      .sort({ start: -1 });

    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

/* ============================
   GET HOST BOOKINGS
   GET /api/bookings/host
============================ */
router.get("/host", auth("lister"), async (req, res) => {
  try {
    const listings = await Listing.find({ ownerId: req.user.id });
    const listingIds = listings.map((l) => l._id);

    const bookings = await Booking.find({
      listingId: { $in: listingIds },
    })
      .populate("listingId")
      .populate("userId", "name email")
      .sort({ start: -1 });

    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: "Failed to load host bookings" });
  }
});

export default router;

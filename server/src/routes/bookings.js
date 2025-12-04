import express from "express";
import Booking from "../models/Booking.js";
import auth from "../middleware/auth.js";

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
   HOST BOOKINGS (Requires Login)
============================================= */
router.get("/host", auth(), async (req, res) => {
  try {
    // find bookings where the spot belongs to this host
    const bookings = await Booking.find()
      .populate({
        path: "spot",
        match: { ownerId: req.user.id }, // only spots owned by this host
      })
      .populate("user", "name");

    // filter out null spots (not owned by this host)
    const hostBookings = bookings.filter(b => b.spot);

    res.json(hostBookings);
  } catch (err) {
    console.error("Host Booking Error:", err);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

export default router;
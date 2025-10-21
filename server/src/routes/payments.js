import express from "express";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create booking + (mock) pay
router.post("/mock-checkout", auth(), async (req,res)=>{
  try {
    const { listingId, start, end } = req.body;
    const listing = await Listing.findById(listingId);
    if(!listing || !listing.available) return res.status(400).json({ error: "Listing not available" });

    const durationHrs = Math.max(1, Math.ceil((new Date(end)-new Date(start)) / (1000*60*60)));
    const amount = durationHrs * (listing.pricePerHour || 10);

    const booking = await Booking.create({
      userId: req.user.id,
      listingId,
      start: new Date(start),
      end: new Date(end),
      paid: true,
      amount, currency: "usd"
    });

    // (Optional) email both parties using sendMail here

    res.json({ ok: true, booking });
  } catch(e){
    res.status(500).json({ error: e.message });
  }
});

export default router;

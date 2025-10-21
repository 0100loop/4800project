import express from "express";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth("user"), async (req,res)=>{
  try {
    const { spotId, start, end } = req.body;
    const listing = await Listing.findById(spotId);
    if(!listing) return res.status(404).json({ error:"Listing not found" });

    const hours = Math.max(1, (new Date(end)-new Date(start))/3600000);
    const totalPrice = Math.round(hours * (listing.pricePerHour || 10));
    // pretend payment success
    const paymentId = "PAY_" + Date.now();

    const booking = await Booking.create({
      userId: req.user.id,
      listingId: listing._id,
      start, end, totalPrice,
      status:"paid", paymentId
    });
    res.json({ message:"Booking confirmed", booking });
  } catch(e){ res.status(400).json({ error:e.message }); }
});

export default router;

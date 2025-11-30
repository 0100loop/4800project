import express from "express";
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// Create listing (host)
router.post("/", auth("user"), async (req,res)=>{
  try {
    const doc = await Listing.create({ ...req.body, ownerId: req.user.id });
    res.json(doc);
  } catch(e){ res.status(400).json({ error:e.message }); }
});

// Get listings - handles both spotId query and nearby search
router.get("/", async (req,res)=>{
  try {
    const { lat, lng, maxKm = 10, spotId } = req.query;
    
    // If spotId is provided, query by spotId
    if (spotId) {
      console.log('Querying listings with spotId:', spotId);
      const listings = await Listing.find({ 
        spotId: new mongoose.Types.ObjectId(spotId),
        isActive: true 
      });
      console.log('Found listings:', listings.length);
      return res.json(listings);
    }
    
    // Otherwise, do nearby search
    if (!lat || !lng) return res.json([]);
    
    const toRad = d => (Number(d) * Math.PI) / 180;
    const R = 6371;
    const all = await Listing.find({ isActive:true });
    const near = all.filter(x=>{
      const dLat = toRad(x.lat - lat), dLng = toRad(x.lng - lng);
      const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat))*Math.cos(toRad(x.lat))*Math.sin(dLng/2)**2;
      const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const dist = R*c;
      return dist <= Number(maxKm);
    }).map(x=>({
      ...x.toObject(),
      distanceKm: Number(
        (function(){
          const dLat = toRad(x.lat - lat), dLng = toRad(x.lng - lng);
          const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat))*Math.cos(toRad(x.lat))*Math.sin(dLng/2)**2;
          const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return (R*c);
        })().toFixed(2)
      )
    }));
    res.json(near);
  } catch(e) {
    console.error('Error fetching listings:', e);
    res.status(500).json({ error: e.message });
  }
});

// Delete listing
router.delete("/:id", auth("user"), async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({ 
      _id: req.params.id,
      ownerId: req.user.id // Only allow owner to delete
    });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json({ success: true });
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
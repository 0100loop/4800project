import express from "express";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// Create listing (host)
router.post("/", auth("lister"), async (req,res)=>{
  try {
    const doc = await Listing.create({ ...req.body, ownerId: req.user.id });
    res.json(doc);
  } catch(e){ res.status(400).json({ error:e.message }); }
});

// Nearby search
router.get("/", async (req,res)=>{
  const { lat, lng, maxKm = 10 } = req.query;
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
});

export default router;

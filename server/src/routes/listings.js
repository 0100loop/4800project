import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import Spot from "../models/Spot.js";

const router = express.Router();

router.post("/", auth("lister"), async (req, res) => {
  try {
    const {
      title, pricePerHour, lat, lng, address,
      bathroom = false, evCharging = false, shuttle = false,
      tailgateFriendly = false, overnightAllowed = false
    } = req.body;

    if ([lat, lng].some(v => typeof v !== "number")) {
      return res.status(400).json({ error: "lat and lng must be numbers" });
    }

    const spot = await Spot.create({
      title,
      pricePerHour,
      location: { type: "Point", coordinates: [lng, lat] },
      address,
      features: { bathroom, evCharging, shuttle, tailgateFriendly, overnightAllowed },
      hostId: new mongoose.Types.ObjectId(req.user.id)
    });

    res.status(201).json(spot);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

router.get("/", async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const maxKm = parseFloat(req.query.maxKm || "10");

    const match = (isFinite(lat) && isFinite(lng))
      ? {
          location: {
            $near: {
              $geometry: { type: "Point", coordinates: [lng, lat] },
              $maxDistance: maxKm * 1000
            }
          }
        }
      : {};

    const results = await Spot.find(match).limit(50).lean();
    res.json(results);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

export default router;

import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import fetch from "node-fetch";
import Spot from "../models/Spot.js";

const router = express.Router();

/**
 * Flexible model that maps to the "spots" collection without enforcing a schema.
 * This avoids conflicts if you already have a Spot model with different fields.
const Spot =
  mongoose.models.__ParkItSpot ||
  mongoose.model(
    "__ParkItSpot",
    new mongoose.Schema({}, { strict: false }),
    "spots"
  );
  */

// GET /api/spots  -> list spots (optionally filter by near lat/lng & radius in meters)
router.get("/", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    let spots;

    if (lat && lng && radius) {
      // Find spots near provided coordinates
      spots = await Spot.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
            $maxDistance: Number(radius),
          },
        },
      })
        .populate("host", "name email") // 👈 populate host info
        .limit(100);
    } else {
      // Find all spots (limit 200)
      spots = await Spot.find()
        .populate("host", "name email") // 👈 also populate here
        .limit(200);
    }

    res.json(spots);
  } catch (e) {
    console.error("GET /api/spots error:", e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/mine", auth(), async (req, res) => {
  try {
    const spots = await Spot.find({ host: req.user.id })
      .populate("host", "name email"); // 👈 populate for your own listings too
    res.json(spots);
  } catch (e) {
    console.error("GET /api/spots/mine error:", e);
    res.status(500).json({ error: "Failed to load user spots" });
  }
});

// GET /api/spots/:id -> one spot
router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: "Not found" });
    res.json(spot);
  } catch (e) {
    console.error("GET /api/spots/:id error:", e);
    res.status(400).json({ error: "Invalid id" });
  }
});

// POST /api/spots -> create (for Host dashboard)
router.post("/", auth(), async (req, res) => {
  try {
    const query = encodeURIComponent(req.body.address);
const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&countrycodes=us&q=${query}`,
  {
    headers: {
      "User-Agent": "ParkItApp/1.0 (contact@parkit.dev)" 
    }
  }
);

if (!geoRes.ok) {
  const errText = await geoRes.text();
  console.error("Geocoding error:", errText);
  return res.status(400).json({ error: "Failed to reach geocoding service" });
}

let geoData;
try {
  geoData = await geoRes.json();
} catch (err) {
  console.error("Geocoding returned invalid JSON:", err);
  return res.status(400).json({ error: "Invalid response from geocoding service" });
}

if (!geoData.length) {
  return res.status(400).json({ error: "Could not find location for that address" });
}

const { lat, lon } = geoData[0];



    const doc = await Spot.create({
      ...req.body,
      host: req.user.id, // associate the spot with the current user's id
      location: {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)] // GeoJSON uses [lng, lat]
      }
    });
    
    res.status(201).json(doc);
  } catch (e) {
    console.error("POST /api/spots error:", e);
    res.status(400).json({ error: e.message });
  }
});

export default router;

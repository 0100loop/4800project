import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * Flexible model that maps to the "spots" collection without enforcing a schema.
 * This avoids conflicts if you already have a Spot model with different fields.
 */
const Spot =
  mongoose.models.__ParkItSpot ||
  mongoose.model(
    "__ParkItSpot",
    new mongoose.Schema({}, { strict: false }),
    "spots"
  );

// GET /api/spots  -> list spots (optionally filter by near lat/lng & radius in meters)
router.get("/", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (lat && lng && radius) {
      // Expect spot doc to have: location: { type: "Point", coordinates: [lng, lat] }
      const spots = await Spot.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
            $maxDistance: Number(radius),
          },
        },
      }).limit(100);
      return res.json(spots);
    }

    const spots = await Spot.find().limit(200);
    res.json(spots);
  } catch (e) {
    console.error("GET /api/spots error:", e);
    res.status(500).json({ error: e.message });
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
router.post("/", async (req, res) => {
  try {
    const doc = await Spot.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    console.error("POST /api/spots error:", e);
    res.status(400).json({ error: e.message });
  }
});

export default router;

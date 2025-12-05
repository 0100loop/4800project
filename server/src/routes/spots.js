import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import fetch from "node-fetch";
import Spot from "../models/Spot.js";

const router = express.Router();

/**
 * GET /api/spots
 * List spots, optionally filter by coordinates & radius
 */
router.get("/", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    let spots;

    if (lat && lng && radius) {
      spots = await Spot.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
            $maxDistance: Number(radius),
          },
        },
      })
        .populate("host", "name email")
        .limit(100);
    } else {
      spots = await Spot.find()
        .populate("host", "name email")
        .limit(200);
    }

    res.json(spots);
  } catch (e) {
    console.error("GET /api/spots error:", e);
    res.status(500).json({ error: "Failed to load spots" });
  }
});

/**
 * GET /api/spots/mine
 * Return spots owned by logged-in user
 */
router.get("/mine", auth(), async (req, res) => {
  try {
    const spots = await Spot.find({ host: req.user.id }).populate("host", "name email");
    res.json(spots);
  } catch (e) {
    console.error("GET /api/spots/mine error:", e);
    res.status(500).json({ error: "Failed to load user spots" });
  }
});

/**
 * GET /api/spots/:id
 * Return one spot by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id).populate("host", "name email");
    if (!spot) return res.status(404).json({ error: "Spot not found" });
    res.json(spot);
  } catch (e) {
    console.error("GET /api/spots/:id error:", e);
    res.status(400).json({ error: "Invalid spot ID" });
  }
});

/**
 * POST /api/spots
 * Create a new spot (host only)
 * Uses OpenStreetMap Nominatim API for geocoding
 */
router.post("/", auth(), async (req, res) => {
  try {
    const { address, location } = req.body;

    if (!address) return res.status(400).json({ error: "Address is required" });

    let coordinates;

    // ✅ Use client-side geocoded coordinates if provided
    if (location?.coordinates?.length === 2) {
      coordinates = location.coordinates;
    } else {
      // Optional: fallback server-side geocoding if you want
      const query = encodeURIComponent(address);
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&countrycodes=us&q=${query}`,
          {
            headers: {
              "User-Agent": "parki-app/1.0 (contact@parki.dev)",
              "Accept-Language": "en",
            },
          }
        );

        if (!geoRes.ok) {
          const errText = await geoRes.text();
          console.error("Geocoding error:", errText);
          return res.status(400).json({ error: "Failed to reach geocoding service" });
        }

        const geoData = await geoRes.json();
        if (!geoData.length) {
          return res.status(400).json({ error: "Could not find location for that address" });
        }

        const { lat, lon } = geoData[0];
        coordinates = [parseFloat(lon), parseFloat(lat)];
      } catch (err) {
        console.error("Server-side geocoding failed:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    // Create spot with coordinates
    const spot = await Spot.create({
      ...req.body,
      host: req.user.id,
      isActive: true,
      location: {
        type: "Point",
        coordinates,
      },
    });

    res.status(201).json({ message: "Spot created", spot });
  } catch (e) {
    console.error("POST /api/spots error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;

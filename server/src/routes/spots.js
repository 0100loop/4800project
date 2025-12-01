import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import fetch from "node-fetch";
import Spot from "../models/Spot.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

const router = express.Router();

/* ================================
      GET ALL SPOTS (OPTIONAL GEO)
================================ */
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
    res.status(500).json({ error: e.message });
  }
});

/* ================================
         GET MY SPOTS
================================ */
router.get("/mine", auth("user"), async (req, res) => {
  try {
    const spots = await Spot.find({ host: req.user.id })
      .populate("host", "name email");

    res.json(spots);
  } catch (e) {
    console.error("GET /api/spots/mine error:", e);
    res.status(500).json({ error: "Failed to load user spots" });
  }
});

/* ================================
          GET SPOT BY ID
================================ */
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

/* ================================
         CREATE NEW SPOT
================================ */
router.post("/", auth("user"), async (req, res) => {
  try {
    const query = encodeURIComponent(req.body.address);

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&countrycodes=us&q=${query}`,
      {
        headers: {
          "User-Agent": "ParkItApp/1.0 (contact@parkit.dev)",
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

    const spot = await Spot.create({
      ...req.body,
      host: req.user.id,
      location: {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      },
    });

    res.status(201).json(spot);
  } catch (e) {
    console.error("POST /api/spots error:", e);
    res.status(400).json({ error: e.message });
  }
});

/* ================================
   HOST: VIEW BOOKINGS FOR A SPOT
================================ */
router.get("/:spotId/bookings", auth("user"), async (req, res) => {
  try {
    // Validate spot
    const spot = await Spot.findById(req.params.spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    // Check owner
    if (String(spot.host) !== String(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Fetch bookings for this spot
    const bookings = await Booking.find({ spotId: spot._id })
      .populate("userId", "name email")
      .sort({ date: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("GET spot bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

import express from "express";
import Spot from "../models/Spot.js";
import axios from "axios";

const router = express.Router();

/* =============================================
   Middleware: Require Auth (example)
   Assumes req.user is set by your auth system
============================================= */


/* =============================================
   CREATE SPOT (Requires Login)
============================================= */
import auth from "../middleware/auth.js";

router.post("/", auth(), async (req, res) => {
  try {
    const spot = await Spot.create({
      ownerId: req.user.id,          // attach logged-in user
      address: req.body.address || "",
      closestStadium: req.body.closestStadium || "",
      price: req.body.price || 0,
      spacesAvailable: req.body.spacesAvailable || 0,
      isActive: true,
    });

    res.json(spot); // return the full spot
  } catch (err) {
    console.error("Create Spot Error:", err);
    res.status(500).json({ error: "Failed to create spot" });
  }
});

/* =============================================
   UPDATE SPOT (Requires Login & Ownership)
============================================= */
router.put("/:id", auth(), async (req, res) => {
  try {
    const { address, closestStadium, price, spacesAvailable } = req.body;

    let latitude = null;
    let longitude = null;

    if (address) {
      const geoURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`;
      const geoRes = await axios.get(geoURL);
      if (geoRes.data.length > 0) {
        latitude = geoRes.data[0].lat;
        longitude = geoRes.data[0].lon;
      }
    }

    const updated = await Spot.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id }, // enforce ownership
      { address, closestStadium, latitude, longitude, price, spacesAvailable },
      { new: true }
    );

    if (!updated) {
      return res.status(403).json({ error: "Not authorized to update this spot" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update Spot Error:", err);
    res.status(500).json({ error: "Failed to update spot" });
  }
});

/* =============================================
   GET MY SPOTS (Requires Login)
============================================= */
router.get("/mine", auth(), async (req, res) => {
  try {
    const spots = await Spot.find({ ownerId: req.user.id });
    res.json(spots);
  } catch (err) {
    console.error("Load Spots Error:", err);
    res.status(500).json({ error: "Failed to load spots" });
  }
});

/* =============================================
   GET SPOTS NEAR A STADIUM (Public)
============================================= */
router.get("/near", async (req, res) => {
  try {
    const stadium = req.query.stadium;
    if (!stadium) return res.status(400).json({ error: "Stadium required" });

    const spots = await Spot.find({ closestStadium: stadium, isActive: true });
    res.json(spots);
  } catch (err) {
    console.error("Nearby Spot Error:", err);
    res.status(500).json({ error: "Failed to load spots" });
  }
});

/* =============================================
   DELETE SPOT (Requires Login & Ownership)
============================================= */
router.delete("/:id", auth(), async (req, res) => {
  try {
    const deleted = await Spot.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!deleted) {
      return res.status(403).json({ error: "Not authorized to delete this spot" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete Spot Error:", err);
    res.status(500).json({ error: "Failed to delete spot" });
  }
});

export default router;
import express from "express";
import Spot from "../models/Spot.js";
import axios from "axios";

const router = express.Router();

/* =============================================
   CREATE SPOT (Public - No Login Required)
============================================= */
router.post("/", async (req, res) => {
  try {
    const spot = await Spot.create({});
    res.json({ id: spot._id });
  } catch (err) {
    console.error("Create Spot Error:", err);
    res.status(500).json({ error: "Failed to create spot" });
  }
});

/* =============================================
   UPDATE SPOT (Public - No Login Required)
============================================= */
router.put("/:id", async (req, res) => {
  try {
    const { address, closestStadium, price, spacesAvailable } = req.body;

    let latitude = null;
    let longitude = null;

    if (address) {
      const geoURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      const geoRes = await axios.get(geoURL);
      if (geoRes.data.length > 0) {
        latitude = geoRes.data[0].lat;
        longitude = geoRes.data[0].lon;
      }
    }

    const updated = await Spot.findByIdAndUpdate(
      req.params.id,
      { address, closestStadium, latitude, longitude, price, spacesAvailable },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update Spot Error:", err);
    res.status(500).json({ error: "Failed to update spot" });
  }
});

/* =============================================
   GET ALL SPOTS (Public)
============================================= */
router.get("/mine", async (req, res) => {
  try {
    const spots = await Spot.find();
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

    const spots = await Spot.find({ closestStadium: stadium });

    res.json(spots);
  } catch (err) {
    console.error("Nearby Spot Error:", err);
    res.status(500).json({ error: "Failed to load spots" });
  }
});

/* =============================================
   DELETE SPOT (Public)
============================================= */
router.delete("/:id", async (req, res) => {
  try {
    await Spot.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Spot Error:", err);
    res.status(500).json({ error: "Failed to delete spot" });
  }
});

export default router;

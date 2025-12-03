import express from "express";
import Spot from "../models/Spot.js";
import axios from "axios";

const router = express.Router();

/* =============================================
   CREATE EMPTY SPOT (FIRST STEP)
   (User presses "+ Add Spot")
============================================= */
router.post("/", async (req, res) => {
  try {
    const ownerId = req.user?._id;

    if (!ownerId)
      return res.status(401).json({ error: "Not authorized" });

    // Create empty spot to be completed later
    const spot = await Spot.create({ owner: ownerId });

    return res.json({ id: spot._id });
  } catch (err) {
    console.error("Create Spot Error:", err);
    res.status(500).json({ error: "Failed to create spot" });
  }
});

/* =============================================
   UPDATE SPOT WITH ADDRESS + STADIUM + PRICE
   (Called when CreateListing submits)
============================================= */
router.put("/:id", async (req, res) => {
  try {
    const spotId = req.params.id;
    const ownerId = req.user?._id;

    const { address, closestStadium, price, spacesAvailable } = req.body;

    // Get lat/lon from address
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
      { _id: spotId, owner: ownerId },
      {
        address,
        closestStadium,
        latitude,
        longitude,
        price,
        spacesAvailable,
      },
      { new: true }
    );

    if (!updated)
      return res.status(400).json({ error: "Spot not found or unauthorized" });

    res.json(updated);

  } catch (err) {
    console.error("Update Spot Error:", err);
    res.status(500).json({ error: "Failed to update spot" });
  }
});

/* =============================================
   GET HOST'S SPOTS
============================================= */
router.get("/mine", async (req, res) => {
  try {
    const ownerId = req.user?._id;

    const spots = await Spot.find({ owner: ownerId });
    res.json(spots);
  } catch (err) {
    console.error("Load Host Spots Error:", err);
    res.status(500).json({ error: "Failed to load spots" });
  }
});

/* =============================================
   DELETE SPOT
============================================= */
router.delete("/:id", async (req, res) => {
  try {
    const ownerId = req.user?._id;
    const spotId = req.params.id;

    const deleted = await Spot.findOneAndDelete({
      _id: spotId,
      owner: ownerId,
    });

    if (!deleted)
      return res.status(404).json({ error: "Spot not found or unauthorized" });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete Spot Error:", err);
    res.status(500).json({ error: "Failed to delete spot" });
  }
});

export default router;



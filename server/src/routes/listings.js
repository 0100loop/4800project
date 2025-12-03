import express from "express";
import Spot from "../models/Spot.js";

const router = express.Router();

/* =============================================
   CREATE LISTING FOR A SPOT
============================================= */
router.post("/", async (req, res) => {
  try {
    const userId = req.user?._id;
    const { spotId, date, startTime, endTime, price, spacesAvailable, address, closestStadium } =
      req.body;

    if (!spotId)
      return res.status(400).json({ error: "Missing spot ID" });

    // Update the spot with listing info
    const updated = await Spot.findOneAndUpdate(
      { _id: spotId, owner: userId },
      {
        date,
        startTime,
        endTime,
        price,
        spacesAvailable,
        address,
        closestStadium,
      },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Spot not found or unauthorized" });

    res.json(updated);

  } catch (err) {
    console.error("Create Listing Error:", err);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

export default router;




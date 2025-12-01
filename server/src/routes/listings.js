import express from "express";
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import Spot from "../models/Spot.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ===========================================
   CREATE LISTING FOR A SPOT (HOST)
=========================================== */
router.post("/", auth("user"), async (req, res) => {
  try {
    const { spotId, date, startTime, endTime, price, spacesAvailable } = req.body;

    const spot = await Spot.findById(spotId);
    if (!spot) return res.status(404).json({ error: "Spot not found" });

    const [lng, lat] = spot.location.coordinates;

    const listing = await Listing.create({
      spotId,
      date,
      startTime,
      endTime,
      price,
      spacesAvailable,
      isActive: true,
      status: "active",
      lat,
      lng,
      location: { type: "Point", coordinates: [lng, lat] },
      bookedSpaces: 0
    });

    res.json({ message: "Listing created", listing });
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===========================================
   GET LISTINGS
=========================================== */
router.get("/", async (req, res) => {
  try {
    const { lat, lng, radius = 2000, spotId, date } = req.query;

    if (spotId) {
      const listings = await Listing.find({
        spotId: new mongoose.Types.ObjectId(spotId),
        isActive: true,
        status: "active",
      });

      return res.json(listings);
    }

    if (!lat || !lng || !date) return res.json([]);

    const eventDate = new Date(date);

    const listings = await Listing.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          distanceField: "distanceMeters",
          maxDistance: Number(radius),
          spherical: true,
        }
      },
      {
        $match: {
          isActive: true,
          status: "active",
          date: eventDate,
          $expr: { $lt: ["$bookedSpaces", "$spacesAvailable"] }
        }
      },
      { $sort: { distanceMeters: 1 } }
    ]);

    const formatted = listings.map(l => ({
      ...l,
      distanceKm: (l.distanceMeters / 1000).toFixed(2)
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Listings error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===========================================
   DELETE LISTING
=========================================== */
router.delete("/:id", auth("user"), async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({
      _id: req.params.id
    });

    if (!listing) return res.status(404).json({ error: "Listing not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;


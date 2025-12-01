import express from "express";
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import auth from "../middleware/auth.js";
import  {geocodeAddress}  from "../utils/geocode.js";
import Spot from "../models/Spot.js";

const router = express.Router();

// Create listing (host)
router.post("/", async (req, res) => {
  try {
    const { spotId, date, startTime, endTime, price, spacesAvailable } = req.body;

    if (!spotId) return res.status(400).json({ error: "spotId is required" });

    const spot = await Spot.findById(spotId);
    if (!spot) return res.status(404).json({ error: "Spot not found" });

    // Use the spot's coordinates
    const [lng, lat] = spot.location.coordinates;

    const listing = await Listing.create({
      spotId,
      date,
      startTime,
      endTime,
      price,
      spacesAvailable,

      lat,
      lng,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      },
       booked: { type: Boolean, default: false }
    });

    res.json({ message: "Listing created", listing });
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Get listings - handles both spotId query and nearby search
router.get("/", async (req, res) => {
  try {
    const { lat, lng, radius = 2000, spotId, date } = req.query;

    // 1. If specific spotId is provided → return its listings
    if (spotId) {
      console.log("Fetching listings for spot:", spotId);

      const listings = await Listing.find({
        spotId: new mongoose.Types.ObjectId(spotId),
        isActive: true,
        status: "active", // FIX: this matches your DB
      });

      console.log("Listings returned:", listings.length);
      return res.json(listings);
    }

    // 2. Geospatial search (venue lat/lng required)
    if (!lat || !lng) return res.json([]);

    // 3. Date filter required for event matching
    if (!date) {
      return res.status(400).json({ error: "Event date (date param) is required" });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const listings = await Listing.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          },
          distanceField: "distanceMeters",
          spherical: true,
          maxDistance: Number(radius)
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
      {
        $sort: { distanceMeters: 1 }
      }
    ]);

    const formatted = listings.map(l => ({
      ...l,
      distanceKm: (l.distanceMeters / 1000).toFixed(2)
    }));

    res.json(formatted);

  } catch (e) {
    console.error("❌ Error fetching listings:", e);
    res.status(500).json({ error: e.message });
  }
});




// Delete listing
router.delete("/:id", auth("user"), async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({ 
      _id: req.params.id,
      ownerId: req.user.id // Only allow owner to delete
    });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json({ success: true });
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
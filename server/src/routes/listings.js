import express from "express";
import Listing from "../models/Listing.js";
import Spot from "../models/Spot.js";
import { upsertListingFromSpot } from "../utils/listingSync.js";

const router = express.Router();

function formatListing(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : doc;
  return {
    ...plain,
    pricePerHour: plain.pricePerHour || plain.price || 0,
  };
}

/* =============================================
   FETCH LISTINGS
============================================= */
router.get("/", async (req, res) => {
  try {
    const { spotId, listingId, lat, lng, maxKm = 5, stadium } = req.query;

    if (listingId) {
      const listing = await Listing.findById(listingId);
      if (!listing) return res.status(404).json({ error: "Listing not found" });
      return res.json(formatListing(listing));
    }

    if (spotId) {
      const listings = await Listing.find({ spotId }).sort({ date: 1 });
      return res.json(listings.map(formatListing));
    }

    if (stadium) {
      const listings = await Listing.find({
        closestStadium: stadium,
        isActive: true,
      }).sort({ date: 1 });
      return res.json(listings.map(formatListing));
    }

    if (lat && lng) {
      const latitude = Number(lat);
      const longitude = Number(lng);
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return res.status(400).json({ error: "Invalid coordinates" });
      }
      const radiusMeters = Number(maxKm) * 1000;

      const listings = await Listing.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] },
            distanceField: "distanceMeters",
            maxDistance: radiusMeters,
            spherical: true,
            query: { isActive: true, status: "active" },
          },
        },
        {
          $addFields: {
            distanceKm: { $divide: ["$distanceMeters", 1000] },
          },
        },
      ]);

      return res.json(listings.map(formatListing));
    }

    const listings = await Listing.find({ isActive: true }).sort({ date: 1 });
    res.json(listings.map(formatListing));
  } catch (err) {
    console.error("List Listings Error:", err);
    res.status(500).json({ error: "Failed to load listings" });
  }
});

/* =============================================
   GET LISTING BY ID
============================================= */
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(formatListing(listing));
  } catch (err) {
    console.error("Get Listing Error:", err);
    res.status(500).json({ error: "Failed to load listing" });
  }
});

/* =============================================
   CREATE OR REFRESH LISTING FOR A SPOT
============================================= */
router.post("/", async (req, res) => {
  try {
    const { spotId, ...payload } = req.body;
    if (!spotId) return res.status(400).json({ error: "Missing spotId" });

    const spot = await Spot.findById(spotId);
    if (!spot) return res.status(404).json({ error: "Spot not found" });

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) {
        spot[key] = value;
      }
    });

    await spot.save();

    const listing = await upsertListingFromSpot(spot, payload);
    if (!listing) {
      return res.status(400).json({
        error:
          "Spot is missing required fields (address, coordinates, schedule, price, spaces)",
      });
    }

    res.json(formatListing(listing));
  } catch (err) {
    console.error("Create Listing Error:", err);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

export default router;
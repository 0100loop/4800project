import express from "express";
import axios from "axios";
import Spot from "../models/Spot.js";
import Listing from "../models/Listing.js";
import { upsertListingFromSpot } from "../utils/listingSync.js";

const router = express.Router();

async function geocodeAddress(address) {
  if (!address) return null;
  const geoURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;
  const geoRes = await axios.get(geoURL);
  if (!geoRes.data.length) return null;
  return {
    latitude: Number(geoRes.data[0].lat),
    longitude: Number(geoRes.data[0].lon),
  };
}

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
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: "Spot not found" });

    const {
      hostName,
      title,
      description,
      address,
      closestStadium,
      price,
      spacesAvailable,
      eventDate,
      startTime,
      endTime,
      amenities,
    } = req.body;

    if (address && address !== spot.address) {
      try {
        const coords = await geocodeAddress(address);
        if (coords) {
          spot.latitude = coords.latitude;
          spot.longitude = coords.longitude;
        }
      } catch (geoErr) {
        console.warn("Geocode failed, keeping previous coordinates", geoErr.message);
      }
    }

    const fields = {
      hostName,
      title,
      description,
      address,
      closestStadium,
      price,
      spacesAvailable,
      eventDate,
      startTime,
      endTime,
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        if ((key === "price" || key === "spacesAvailable") && value !== null) {
          const numeric = Number(value);
          if (!Number.isNaN(numeric)) {
            spot[key] = numeric;
          }
        } else {
          spot[key] = value;
        }
      }
    });

    if (amenities && typeof amenities === "object") {
      spot.amenities = {
        ...(spot.amenities || {}),
        ...amenities,
      };
    }

    await spot.save();

    const listing = await upsertListingFromSpot(spot);

    res.json({
      ...spot.toObject(),
      listing,
    });
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
   GET SINGLE SPOT WITH OPTIONAL LISTING
============================================= */
router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: "Spot not found" });

    const listing = spot.listingId
      ? await Listing.findOne({ spotId: spot._id })
      : null;

    res.json({
      ...spot.toObject(),
      listing,
    });
  } catch (err) {
    console.error("Get Spot Error:", err);
    res.status(500).json({ error: "Failed to load spot" });
  }
});

/* =============================================
   DELETE SPOT (Public)
============================================= */
router.delete("/:id", async (req, res) => {
  try {
    const spot = await Spot.findByIdAndDelete(req.params.id);
    if (spot?.listingId) {
      await Listing.deleteOne({ _id: spot.listingId });
    } else if (spot?._id) {
      await Listing.deleteOne({ spotId: spot._id });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Spot Error:", err);
    res.status(500).json({ error: "Failed to delete spot" });
  }
});

export default router;

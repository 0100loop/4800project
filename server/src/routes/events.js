import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Simple in-memory cache (resets on server restart)
let cache = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

router.get("/", async (req, res) => {
  try {
    const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;
    const CLIENT_SECRET = process.env.SEATGEEK_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("❌ Missing SeatGeek API keys");
      return res.status(500).json({ error: "SeatGeek API credentials missing" });
    }

    // -------- FILTERS --------
    let page = parseInt(req.query.page || "0", 10);

    // 🔧 Fix SeatGeek bug: page=0 is invalid
    if (page === 0) page = 1;

    const city = req.query.city || "";
    const type = req.query.type || ""; // sports, concert, theatre, etc.
    const date = req.query.date || ""; // YYYY-MM-DD

    // -------- CACHE --------
    const cacheKey = `${page}-${city}-${type}-${date}`;
    const now = Date.now();

    if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
      console.log("⚡ Serving events from cache:", cacheKey);
      return res.json(cache[cacheKey].data);
    }

    // -------- BUILD SEATGEEK URL --------
    let url = `https://api.seatgeek.com/2/events?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&page=${page}&per_page=20&sort=datetime_local.asc`;

    if (city) url += `&venue.city=${encodeURIComponent(city)}`;
    if (type) url += `&taxonomies.name=${encodeURIComponent(type)}`;
    if (date)
      url += `&datetime_local.gte=${date}T00:00:00&datetime_local.lte=${date}T23:59:59`;

    console.log("🔍 Fetching SeatGeek URL:", url);

    // -------- API REQUEST --------
    const response = await axios.get(url);
    const sgEvents = response.data.events || [];

    // -------- FORMAT EVENTS --------
    const formatted = sgEvents.map((e) => ({
      id: e.id,
      name: e.title,
      venue: e.venue?.name || "Unknown Venue",
      address: `${e.venue?.city || ""}, ${e.venue?.state || ""}`,
      date: e.datetime_local || "TBA",
      image:
        e.performers?.[0]?.image ||
        "https://via.placeholder.com/800x400?text=No+Image",
      priceFrom: e.stats?.lowest_price || null,
      performers: e.performers?.map((p) => p.name) || [],
      genre: e.taxonomies?.[0]?.name || "General",
      url: e.url,
    }));

    // -------- STORE IN CACHE --------
    cache[cacheKey] = {
      timestamp: now,
      data: formatted,
    };

    res.json(formatted);
  } catch (err) {
    console.error("❌ SeatGeek API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;


import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { venue = "" } = req.query;

    if (!process.env.TM_API_KEY) {
      return res.status(500).json({ error: "TM_API_KEY missing" });
    }

    // Default keyword if none is provided (prevents empty results)
    const keyword = venue.trim() === "" ? "stadium" : venue.trim();

    const params = new URLSearchParams({
      apikey: process.env.TM_API_KEY,
      keyword,
      size: "20",
      sort: "date,asc"
    });

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;

    const response = await axios.get(url);

    const events = response.data._embedded?.events || [];

    const items = events.map((e) => ({
      id: e.id,
      name: e.name || "Untitled Event",
      date: e.dates?.start?.localDate || null,
      time: e.dates?.start?.localTime || null,
      venue: e._embedded?.venues?.[0]?.name || "Unknown Venue",
      city: e._embedded?.venues?.[0]?.city?.name || "Unknown City",
      lat: Number(e._embedded?.venues?.[0]?.location?.latitude || 0),
      lng: Number(e._embedded?.venues?.[0]?.location?.longitude || 0)
    }));

    // If no events returned, give fallback demo events
    if (items.length === 0) {
      return res.json([
        {
          id: "demo1",
          name: "NBA Game - Lakers vs Warriors",
          date: "2025-06-01",
          time: "19:00",
          venue: "Crypto.com Arena",
          city: "Los Angeles",
          lat: 34.0430,
          lng: -118.2673
        },
        {
          id: "demo2",
          name: "NFL - Rams Home Game",
          date: "2025-06-05",
          time: "17:00",
          venue: "SoFi Stadium",
          city: "Inglewood",
          lat: 33.9533,
          lng: -118.3387
        }
      ]);
    }

    res.json(items);

  } catch (e) {
    console.error("Ticketmaster error:", e.response?.data || e.message);
    res.status(500).json({
      error: "Failed to fetch events",
      details: e.response?.data || null
    });
  }
});

export default router;


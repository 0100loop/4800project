import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const API_KEY = process.env.TM_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "TM_API_KEY missing in server" });
    }

    const url =
      "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" +
      API_KEY +
      "&city=Los Angeles&size=20&sort=date,asc";

    const response = await axios.get(url);

    const events = response.data._embedded?.events || [];

    const formatted = events.map((e) => {
      const venue = e._embedded?.venues?.[0];

      return {
        id: e.id,
        name: e.name,
        venue: venue?.name || "Unknown Venue",
        date:
          e.dates?.start?.localDate +
            (e.dates?.start?.localTime
              ? " " + e.dates.start.localTime
              : "") || "TBA",
        image:
          e.images?.find((img) => img.width >= 800)?.url ||
          e.images?.[0]?.url ||
          "https://via.placeholder.com/800x400?text=No+Image",
        priceFrom: e.priceRanges?.[0]?.min || null,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Ticketmaster error:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;



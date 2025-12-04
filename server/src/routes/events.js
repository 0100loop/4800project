import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;
    const CLIENT_SECRET = process.env.SEATGEEK_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ error: "SeatGeek API credentials missing" });
    }

    let page = parseInt(req.query.page || "1", 10);
    if (page < 1) page = 1;

    // Build SeatGeek API URL
    const url = `https://api.seatgeek.com/2/events?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&page=${page}&per_page=20&sort=datetime_local.asc`;

    const response = await axios.get(url);
    const sgEvents = response.data.events || [];

    const now = new Date();

    // FORMAT + FILTER FUTURE EVENTS
    const formatted = sgEvents
      .map((e) => ({
        id: e.id,
        title: e.title,
        datetime_local: e.datetime_local,
        url: e.url,
        performers: e.performers || [],
        stats: e.stats || [],

        image:
          e.image ||
          e.performers?.[0]?.image ||
          "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",

        venue: {
          name:
            e.venue?.name ||
            e.performers?.[0]?.venue_name ||
            e.performers?.[0]?.short_name ||
            "Unknown Venue",

          city:
            e.venue?.city ||
            e.performers?.[0]?.location?.city ||
            "",

          state:
            e.venue?.state ||
            e.performers?.[0]?.location?.state ||
            "",

          address:
            e.venue?.address ||
            e.performers?.[0]?.location?.address ||
            "",

          lat: e.venue?.location?.lat || e.venue?.lat || e.performers?.[0]?.location?.lat || null,
          lon: e.venue?.location?.lon || e.venue?.lon || e.performers?.[0]?.location?.lon || null,
        },
      }))
      .filter((e) => {
        const eventDate = new Date(e.datetime_local);
        return eventDate >= now; // ONLY FUTURE EVENTS
      });

    return res.json(formatted);
  } catch (err) {
    console.error("SeatGeek API error:", err);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;

import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/* ==========================================================
   SEARCH SEATGEEK EVENTS (Works for stadiums + teams + events)
   Uses ?q=sofi
   Only returns FUTURE events
========================================================== */
router.get("/events", async (req, res) => {
  try {
    const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;
    const CLIENT_SECRET = process.env.SEATGEEK_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ error: "SeatGeek credentials missing" });
    }

    const q = req.query.q || "";
    const page = req.query.page || 1;

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      page,
      per_page: 25,
    });

    if (q) params.append("q", q.toLowerCase());

    const url = `https://api.seatgeek.com/2/events?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    const now = new Date();

    // Filter future events only
    const events = (data.events || []).filter(
      (e) => new Date(e.datetime_local) >= now
    );

    return res.json({ events });
  } catch (err) {
    console.error("SeatGeek Search Error:", err);
    return res.status(500).json({ error: "SeatGeek Error" });
  }
});

export default router;


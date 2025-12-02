// server.js  (WORKING VERSION)

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

// READ KEY
const TM_API_KEY = process.env.TICKETMASTER_API_KEY;

// BACKEND PROXY ROUTE (THIS MUST MATCH /tm/events)
app.get("/tm/events", async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    params.append("apikey", TM_API_KEY);

    // Build the Ticketmaster URL
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;
    const response = await fetch(url);

    // If Ticketmaster blocks or fails
    if (!response.ok) {
      return res.status(500).json({ error: "Ticketmaster fetch failed" });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// RUN ON PORT 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Ticketmaster proxy running on http://localhost:${PORT}`);
});


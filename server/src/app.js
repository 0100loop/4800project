// src/app.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// ---------------------------------------------
// ⭐ HEALTH CHECK
// ---------------------------------------------
app.get("/", (req, res) => {
  res.send("SeatGeek Proxy Running");
});

// ---------------------------------------------
// ⭐ SEATGEEK EVENTS PROXY
// ---------------------------------------------
app.get("/sg/events", async (req, res) => {
  try {
    const CLIENT_ID = process.env.SEATGEEK_CLIENT_ID;
    const CLIENT_SECRET = process.env.SEATGEEK_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ error: "Missing SeatGeek API Keys" });
    }

    const params = new URLSearchParams(req.query);
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);

    const sgURL = `https://api.seatgeek.com/2/events?${params.toString()}`;

    const response = await fetch(sgURL);
    const data = await response.json();

    return res.json(data);

  } catch (err) {
    console.error("SeatGeek Proxy Error:", err);
    return res.status(500).json({ error: "Proxy Error" });
  }
});

export default app;

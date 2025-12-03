import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/events", async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    params.append("client_id", process.env.SEATGEEK_CLIENT_ID);

    const url = `https://api.seatgeek.com/2/events?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("SeatGeek Proxy Error:", err);
    res.status(500).json({ error: "SeatGeek Error" });
  }
});

export default router;

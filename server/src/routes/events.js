import express from "express";
import axios from "axios";
const router = express.Router();

// Simple: search events by venue keyword
router.get("/", async (req,res)=>{
  try {
    const { venue = "", range = "week" } = req.query;
    if (!process.env.TM_API_KEY) return res.status(500).json({ error:"TM_API_KEY missing" });
    const size = 20;
    const params = new URLSearchParams({
      apikey: process.env.TM_API_KEY,
      keyword: venue,
      size: String(size),
      sort: "date,asc"
    });
    const r = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`);
    const items = (r.data._embedded?.events || []).map(e=>({
      id: e.id,
      name: e.name,
      date: e.dates?.start?.localDate,
      time: e.dates?.start?.localTime,
      venue: e._embedded?.venues?.[0]?.name,
      city: e._embedded?.venues?.[0]?.city?.name,
      lat: Number(e._embedded?.venues?.[0]?.location?.latitude || 0),
      lng: Number(e._embedded?.venues?.[0]?.location?.longitude || 0)
    }));
    res.json(items);
  } catch(e){
    res.status(500).json({ error:e.message, up:e.response?.data || null });
  }
});

export default router;

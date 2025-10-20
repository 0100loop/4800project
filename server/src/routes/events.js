import express from 'express';
const router = express.Router();

const TM_API_KEY = process.env.TM_API_KEY;

// Fallback sample events so UI works even if API/key fails
const SAMPLE_EVENTS = [
  {
    id: "SAMPLE1",
    name: "49ers vs. Seahawks",
    date: new Date(Date.now() + 24*3600*1000).toISOString(),
    venue: "Levi's Stadium",
    city: "Santa Clara",
    lat: 37.4030,
    lng: -121.9700,
    url: "https://www.49ers.com/"
  },
  {
    id: "SAMPLE2",
    name: "Taylor Swift | The Eras Tour",
    date: new Date(Date.now() + 3*24*3600*1000).toISOString(),
    venue: "Levi's Stadium",
    city: "Santa Clara",
    lat: 37.4030,
    lng: -121.9700,
    url: "https://www.ticketmaster.com/"
  }
];

router.get('/', async (req, res) => {
  const { venue, range = 'week' } = req.query;

  const start = new Date();
  const end = new Date(start);
  if (range === 'week') end.setDate(start.getDate() + 7);
  else if (range === 'month') end.setMonth(start.getMonth() + 1);

  const startStr = start.toISOString();
  const endStr = end.toISOString();

  if (!TM_API_KEY) {
    return res.json(SAMPLE_EVENTS);
  }

  try {
    const venueParam = venue ? `&keyword=${encodeURIComponent(venue)}` : '';
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TM_API_KEY}${venueParam}&startDateTime=${startStr}&endDateTime=${endStr}&size=20&sort=date,asc`;

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Ticketmaster HTTP ${resp.status}`);
    const data = await resp.json();

    const events = (data._embedded?.events || []).map(e => {
      const v = e._embedded?.venues?.[0];
      return {
        id: e.id,
        name: e.name,
        date: e.dates?.start?.dateTime || e.dates?.start?.localDate,
        venue: v?.name,
        city: v?.city?.name,
        lat: v?.location?.latitude ? Number(v.location.latitude) : null,
        lng: v?.location?.longitude ? Number(v.location.longitude) : null,
        url: e.url
      };
    });

    res.json(events.length ? events : SAMPLE_EVENTS);
  } catch (err) {
    res.json(SAMPLE_EVENTS.map(e => ({ ...e, _note: `fallback: ${err.message}` })));
  }
});

export default router;

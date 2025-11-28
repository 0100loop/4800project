const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ------------------------------
   LOAD FEATURED EVENTS
--------------------------------*/
export async function fetchEvents(search: string = "") {
  try {
    const encoded = encodeURIComponent(search);
    const res = await fetch(`${API_URL}/events?venue=${encoded}`);

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (e) {
    console.error("fetchEvents error:", e);
    return [];
  }
}

/* ------------------------------
   LOAD ALL PARKING SPOTS
--------------------------------*/
export async function fetchSpots() {
  try {
    const res = await fetch(`${API_URL}/spots`);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("fetchSpots error:", e);
    return [];
  }
}

/* ------------------------------
   POPULAR VENUES (from spots)
--------------------------------*/
export async function fetchPopularVenues() {
  try {
    const res = await fetch(`${API_URL}/spots`);
    if (!res.ok) return [];

    const data = await res.json();

    const venues: any[] = [];
    const seen = new Set();

    data.forEach((spot: any) => {
      const venue = spot?.venue;
      if (venue && !seen.has(venue)) {
        venues.push({
          name: venue,
          city: spot.city || "Unknown",
        });
        seen.add(venue);
      }
    });

    return venues.slice(0, 10);
  } catch (e) {
    console.error("fetchPopularVenues error:", e);
    return [];
  }
}

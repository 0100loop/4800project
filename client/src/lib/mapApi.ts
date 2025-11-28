const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------------------------
   LOAD SPOTS NEAR COORDINATES
--------------------------- */
export async function fetchNearbySpots(lat: number, lng: number, radius = 2000) {
  try {
    const url = `${API_URL}/spots?lat=${lat}&lng=${lng}&radius=${radius}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("fetchNearbySpots error:", e);
    return [];
  }
}

/* ---------------------------
   LOAD ALL SPOTS (fallback)
--------------------------- */
export async function fetchAllSpots() {
  try {
    const res = await fetch(`${API_URL}/spots`);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("fetchAllSpots error:", e);
    return [];
  }
}

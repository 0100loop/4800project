const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Load a single spot by ID
 */
export async function fetchSpotById(id: string) {
  try {
    const res = await fetch(`${API_URL}/spots/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to load spot");
    }
    return data;
  } catch (e: any) {
    console.error("fetchSpotById error:", e);
    throw e;
  }
}

/**
 * Optionally, load a few more spots in same city (for “More options near …”)
 */
export async function fetchSpotsByCity(city?: string) {
  try {
    const res = await fetch(`${API_URL}/spots`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    if (!city) return data.slice(0, 4);

    const filtered = data.filter(
      (s: any) =>
        s.city &&
        String(s.city).toLowerCase() === String(city).toLowerCase()
    );

    return filtered.slice(0, 4);
  } catch (e) {
    console.error("fetchSpotsByCity error:", e);
    return [];
  }
}

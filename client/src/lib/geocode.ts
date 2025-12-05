// src/lib/geocode.ts
export async function geocodeAddress(address: string) {
  const query = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&countrycodes=us&q=${query}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "ParkItApp/1.0 (your_email@example.com)", // Nominatim requires a valid User-Agent
      "Accept-Language": "en",
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.length) throw new Error("Address not found");

  const { lat, lon } = data[0];
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

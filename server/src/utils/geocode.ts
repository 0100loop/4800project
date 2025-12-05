// utils/geocode.ts
export async function geocodeAddress(address: string) {
  const query = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "ParkItApp/1.0 (contact@parkit.dev)" }
  });

  if (!res.ok) {
    throw new Error("Failed to geocode address");
  }

  const data = await res.json();
  if (!data.length) {
    throw new Error("Address not found");
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

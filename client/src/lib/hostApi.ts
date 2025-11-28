const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchMySpots() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/spots/mine`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load spots");

  return data;
}

export async function fetchHostBookings() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/bookings/host`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load bookings");

  return data;
}

export async function addNewSpot(payload: any) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/spots`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add spot");

  return data;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchUserBookings() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load bookings");

  return data;
}

export async function fetchHostBookings() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/bookings/host`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load host bookings");

  return data;
}

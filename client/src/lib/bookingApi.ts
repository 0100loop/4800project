const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function createBooking(spotId: string, start: string, end: string, totalPrice: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      spotId,
      start,
      end,
      totalPrice,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Booking failed");

  return data;
}

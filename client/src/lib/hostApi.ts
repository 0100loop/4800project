const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/** ---------------------------
 * Auth Header Helper
 * ---------------------------- */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

/** ---------------------------
 * Types
 * ---------------------------- */

export interface HostSpot {
  _id: string;
  title?: string;
  address?: string;
  city?: string;
  pricePerHour?: number;
  isActive?: boolean;
  maxVehicles?: number;
}

export interface HostBooking {
  _id: string;
  start: string;
  end: string;
  totalPrice: number;
  status: string;
  listingId?: {
    _id: string;
    title?: string;
    address?: string;
    city?: string;
  };
  userId?: {
    name?: string;
    email?: string;
  };
}

/** ---------------------------
 * Fetch Host Spots
 * ---------------------------- */
export async function fetchHostSpots(): Promise<HostSpot[]> {
  const res = await fetch(`${API_URL}/spots/mine`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load host spots");

  return data;
}

/** ---------------------------
 * Fetch Host Bookings
 * ---------------------------- */
export async function fetchHostBookings(): Promise<HostBooking[]> {
  const res = await fetch(`${API_URL}/bookings/host`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load host bookings");

  return data;
}

/** ---------------------------
 * Create New Host Spot
 * ---------------------------- */
export interface CreateSpotPayload {
  title: string;
  address: string;
  city?: string;
  pricePerHour: number;
  maxVehicles?: number;
  description?: string;
}

export async function createHostSpot(
  payload: CreateSpotPayload
): Promise<HostSpot> {
  const res = await fetch(`${API_URL}/spots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create spot");

  return data;
}

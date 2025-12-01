const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to make a booking.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
  amount: number;
  currency: string;
}

export async function createCheckoutSession(
  listingId: string,
  start: string,
  end: string
): Promise<CheckoutSessionResponse> {
  const res = await fetch(`${API_URL}/payments/checkout-session`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ listingId, start, end }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Unable to start payment.");
  }

  if (!data.url) {
    throw new Error("Stripe session missing redirect URL.");
  }

  return data;
}

export async function confirmCheckoutSession(sessionId: string) {
  const res = await fetch(`${API_URL}/payments/confirm`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ sessionId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Unable to confirm payment.");
  }

  return data.booking;
}


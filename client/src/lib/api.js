
// src/lib/api.js

// Base URL for your API (from .env or fallback to localhost)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ============================
   TOKEN HELPERS
============================ */
export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export function clearToken() {
  localStorage.removeItem("token");
}

/* ============================
   API FETCH WITH AUTH SUPPORT
============================ */
export async function apiFetch(path, { method = "GET", body = null, headers = {} } = {}) {
  // Build full URL
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  // Get token from localStorage
  const token = getToken();

  // Merge headers and attach token if available
  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Perform fetch
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Parse response safely
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { error: text };
  }

  // Throw error if not OK
  if (!res.ok) {
    throw new Error(json?.error || `HTTP ${res.status}`);
  }

  return json;
}
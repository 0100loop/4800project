// src/lib/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* TOKEN HELPERS (login still works) */
export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
}

/* SIMPLE FETCH: NO AUTH ENFORCED */
export async function apiFetch(path, { method = "GET", body = null } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const headers = { "Content-Type": "application/json" };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { error: text };
  }

  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}

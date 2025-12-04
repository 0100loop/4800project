export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* ============ TOKEN HELPERS ============ */
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

/* ============ AUTH HEADERS ============ */
export function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

/* ============ UNIVERSAL FETCH ============ */
export async function apiFetch(
  path,
  { method = "GET", body = null, auth = false } = {}
) {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(auth ? getAuthHeaders() : {}),
  };

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

  if (!res.ok) {
    throw new Error(json.error || `HTTP ${res.status}`);
  }

  return json;
}

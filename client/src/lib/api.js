// Get backend URL from environment variable, fallback to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('token') || '';
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
}

export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  // Prepend the base URL to the path
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
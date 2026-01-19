import { config } from '../config';

// PUBLIC_INTERFACE
export async function apiFetch(path, { method = 'GET', body, headers } = {}) {
  /** Fetch helper that throws on non-2xx responses. */
  const url = `${config.apiBaseUrl}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.detail || msg;
    } catch (e) {
      // ignore
    }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  // Some endpoints return empty dict; still JSON
  return res.json();
}

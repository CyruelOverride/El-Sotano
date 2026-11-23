// Cliente HTTP del backend. URL configurable con VITE_API_URL (ver .env.example).
export const API = (import.meta.env.VITE_API_URL || 'https://el-sotano-back.onrender.com').replace(/\/$/, '');

// authService registra acá cómo leer el token (evita un import circular).
let tokenGetter = () => null;
let onUnauthorized = () => {};
export const configureApi = (getToken, unauthorized) => {
  tokenGetter = getToken;
  onUnauthorized = unauthorized;
};

// Render (plan gratis) tarda en despertar: damos margen antes de rendirnos.
const TIMEOUT_MS = 60000;

export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = tokenGetter();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (auth && res.status === 401) onUnauthorized();
    throw new Error(data?.error || `Error ${res.status}`);
  }
  return data;
}

export const admin = {
  list: (resource, query = {}) => {
    const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v != null)).toString();
    return request(`/api/admin/${resource}${qs ? `?${qs}` : ''}`, { auth: true });
  },
  create: (resource, body) => request(`/api/admin/${resource}`, { method: 'POST', body, auth: true }),
  update: (resource, id, body) => request(`/api/admin/${resource}/${id}`, { method: 'PUT', body, auth: true }),
  remove: (resource, id) => request(`/api/admin/${resource}/${id}`, { method: 'DELETE', auth: true }),
  setConfig: (clave, valor) => request(`/api/admin/configuracion/${encodeURIComponent(clave)}`, { method: 'PUT', body: { valor }, auth: true }),
  upload: (dataUrl) => request('/api/admin/upload', { method: 'POST', body: { dataUrl }, auth: true }),
};

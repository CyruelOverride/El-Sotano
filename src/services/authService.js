/*
 * AUTENTICACIÓN POR JWT (versión en memoria)
 *
 * `login` hoy valida contra un admin de demostración y emite un JWT de mentira
 * (sin firma real). Cuando exista el backend, reemplazá SOLO el cuerpo de `login`:
 *
 *   const res = await fetch(`${API}/api/auth/login`, { method: 'POST',
 *     headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
 *   if (!res.ok) throw new Error('Credenciales inválidas');
 *   setToken((await res.json()).token);
 *
 * El token vive solo en memoria (no en localStorage): recargar la página cierra la sesión.
 * IMPORTANTE: estas credenciales de demostración están en el bundle del navegador; no son seguridad real.
 */
const MOCK_ADMIN = {
  email: import.meta.env.VITE_MOCK_ADMIN_EMAIL || 'admin@elsotano.example',
  password: import.meta.env.VITE_MOCK_ADMIN_PASSWORD || 'admin1234',
};
const TTL_SECONDS = 8 * 60 * 60;

const b64 = (obj) => btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const unb64 = (str) => JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));

let token = null;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getToken = () => token;

export function decodeJwt(t) {
  try {
    return unb64(t.split('.')[1]);
  } catch {
    return null;
  }
}

function setToken(t) {
  token = t;
  emit();
}

export async function login(email, password) {
  await new Promise((r) => setTimeout(r, 300)); // simula latencia de red
  if (email.trim().toLowerCase() !== MOCK_ADMIN.email || password !== MOCK_ADMIN.password) {
    throw new Error('Credenciales inválidas');
  }
  const now = Math.floor(Date.now() / 1000);
  const jwt = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: 1, email: MOCK_ADMIN.email, role: 'admin', iat: now, exp: now + TTL_SECONDS })}.mock`;
  setToken(jwt);
}

export function logout() {
  setToken(null);
}

// Snapshot estable (string) para useSyncExternalStore: cambia solo con el token.
export function getSessionEmail() {
  if (!token) return null;
  const p = decodeJwt(token);
  if (!p || p.role !== 'admin' || p.exp * 1000 < Date.now()) return null;
  return p.email;
}

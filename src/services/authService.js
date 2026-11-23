/*
 * AUTENTICACIÓN POR JWT (contra el backend)
 *
 * `login` llama a POST /api/auth/login y guarda el JWT que firma el servidor.
 * El token vive solo en memoria (no en localStorage): recargar la página cierra la sesión.
 */
import { configureApi, request } from './api';

let token = null;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getToken = () => token;

const unb64 = (str) => JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));

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
  const res = await request('/api/auth/login', { method: 'POST', body: { email: email.trim(), password } });
  if (!res?.token) throw new Error('Credenciales inválidas');
  setToken(res.token);
}

export function logout() {
  setToken(null);
}

// Si el servidor rechaza el token (vencido), se cierra la sesión.
configureApi(getToken, logout);

// Snapshot estable (string) para useSyncExternalStore: cambia solo con el token.
export function getSessionEmail() {
  if (!token) return null;
  const p = decodeJwt(token);
  if (!p || p.exp * 1000 < Date.now()) return null;
  return p.email;
}

import { fallbackData } from '../data/fallbackData';
import { request } from './api';

export const SECTIONS = ['home', 'about', 'events', 'restaurant', 'upcoming', 'guests', 'gallery'];

/*
 * STORE DEL CONTENIDO
 *
 * Se llena con GET /api/content/:section. Si el servidor no responde queda el contenido
 * de demostración (fallbackData, marcado con `_demo`). Las ediciones del admin van al
 * backend (contentActions.js) y después se vuelve a leer la sección: el servidor es la fuente de verdad.
 */
let state = structuredClone(fallbackData);
let version = 0;
let loading = true; // true hasta que termina la primera carga
const listeners = new Set();
const notify = () => { version += 1; listeners.forEach((l) => l()); };

export const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getVersion = () => version;
export const getState = () => state;
export const isLoading = () => loading;

// Lee una o varias secciones del servidor. Las que fallan conservan lo que tenían.
export async function loadSections(sections = SECTIONS) {
  const results = await Promise.allSettled(sections.map((s) => request(`/api/content/${s}`)));
  const next = { ...state };
  let failed = 0;
  results.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value?.data) next[sections[i]] = r.value.data;
    else failed += 1;
  });
  state = next;
  notify();
  if (failed === sections.length) throw new Error('No se pudo cargar el contenido.');
}

export async function initContent() {
  try {
    await loadSections();
  } catch (e) {
    console.warn(e.message); // queda el contenido de demostración
  } finally {
    loading = false;
    notify();
  }
}

export const uid = (prefix = 'x') => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

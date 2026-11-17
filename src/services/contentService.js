import { fallbackData } from '../data/fallbackData';

export const SECTIONS = ['home', 'about', 'events', 'restaurant', 'upcoming', 'guests', 'gallery'];

/*
 * STORE EN MEMORIA
 *
 * Por ahora todo el contenido vive acá (se arma desde fallbackData) y se pierde al recargar.
 * Cuando exista el backend, `getContent` pasará a leer GET /api/content/:section y las
 * funciones de `contentActions.js` a llamar a /api/admin/*. Los componentes no cambian:
 * solo consumen `useContent` y las acciones.
 */
let state = structuredClone(fallbackData);
let version = 0;
const listeners = new Set();

export const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getVersion = () => version;
export const getState = () => state;

export function getContent(section) {
  return Promise.resolve({ data: state[section] ?? null, isFallback: !!state[section]?._demo });
}

// Aplica `fn` sobre una copia de la sección y notifica a los suscriptores.
export function mutate(section, fn) {
  const draft = structuredClone(state[section] ?? {});
  fn(draft);
  state = { ...state, [section]: draft };
  version += 1;
  listeners.forEach((l) => l());
}

export const uid = (prefix = 'x') => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

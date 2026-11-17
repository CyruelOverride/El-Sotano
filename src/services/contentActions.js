// Operaciones de edición sobre el store en memoria. Cada una será luego una llamada a /api/admin/*.
import { mutate, uid } from './contentService';

const walk = (root, path) => path.split('.').reduce((o, k) => o[k], root);

// Mezcla `values` dentro del objeto en `path` (ej. 'hero' → draft.hero).
export function merge(section, path, values) {
  mutate(section, (d) => {
    const target = path ? walk(d, path) : d;
    Object.assign(target, values);
  });
}

// Reemplaza el valor en `path` (ej. 'identity.pillars').
export function setValue(section, path, value) {
  mutate(section, (d) => {
    const keys = path.split('.');
    const last = keys.pop();
    keys.reduce((o, k) => o[k], d)[last] = value;
  });
}

export function pushItem(section, listPath, item) {
  mutate(section, (d) => { walk(d, listPath).push(item); });
}
export function setAt(section, listPath, index, item) {
  mutate(section, (d) => { walk(d, listPath)[index] = item; });
}
export function removeAt(section, listPath, index) {
  mutate(section, (d) => { walk(d, listPath).splice(index, 1); });
}

export function upsertById(section, listPath, item) {
  mutate(section, (d) => {
    const list = walk(d, listPath);
    const i = list.findIndex((x) => x.id === item.id);
    if (i >= 0) list[i] = { ...list[i], ...item };
    else list.push({ ...item, id: item.id || uid() });
  });
}
export function removeById(section, listPath, id) {
  mutate(section, (d) => {
    const list = walk(d, listPath);
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) list.splice(i, 1);
  });
}

export const slugify = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

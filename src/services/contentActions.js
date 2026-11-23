/*
 * Operaciones de edición del admin. Los componentes las llaman con (sección, ruta, valores);
 * acá se traducen a llamadas a /api/admin/* y después se vuelve a leer la sección afectada.
 * Si el servidor falla, la función lanza un Error y el modal muestra el mensaje.
 */
import { admin } from './api';
import { getState, loadSections } from './contentService';

export const slugify = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const isId = (id) => /^\d+$/.test(String(id ?? ''));
const get = (section, path) => path.split('.').reduce((o, k) => o?.[k], getState()[section]);

// ---- Helpers de backend --------------------------------------------------

// Crea o actualiza el artículo identificado por `clave`.
async function upsertArticulo(clave, seccion, data) {
  const found = (await admin.list('articulos', { seccion })).find((a) => a.clave === clave);
  return found ? admin.update('articulos', found.id, data) : admin.create('articulos', { clave, seccion, ...data });
}

// Imagen única identificada por `slot` (ej. portada). url vacía = quitarla.
async function setSlotImage(slot, url) {
  const rows = await admin.list('imagenes', { slot });
  if (!url) {
    for (const r of rows) await admin.remove('imagenes', r.id);
  } else if (rows[0]) {
    if (rows[0].url !== url) await admin.update('imagenes', rows[0].id, { url });
  } else {
    await admin.create('imagenes', { url, slot });
  }
}

// Deja las imágenes de un artículo/evento/alimento exactamente como `urls` (en ese orden).
async function syncOwnerImages(ownerKey, ownerId, urls) {
  const wanted = [...new Set(urls.filter(Boolean))];
  const keep = new Map();
  for (const r of await admin.list('imagenes', { [ownerKey]: ownerId })) {
    if (wanted.includes(r.url) && !keep.has(r.url)) keep.set(r.url, r);
    else await admin.remove('imagenes', r.id);
  }
  for (const [i, url] of wanted.entries()) {
    const row = keep.get(url);
    if (!row) await admin.create('imagenes', { url, [ownerKey]: ownerId, orden: i });
    else if (row.orden !== i) await admin.update('imagenes', row.id, { orden: i });
  }
}

const configNames = async () => {
  const row = (await admin.list('configuracion')).find((c) => c.clave === 'resto.categorias');
  return Array.isArray(row?.valor) ? row.valor : [];
};

// "$4.500,50" → 4500.5 ; vacío o ilegible → null
function parsePrice(p) {
  if (p === null || p === undefined || p === '') return null;
  if (typeof p === 'number') return p;
  let s = String(p).replace(/[^\d.,]/g, '');
  // Coma = decimal ("4.500,50"); puntos de a 3 dígitos = miles ("4.500").
  if (s.includes(',') || /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
  const n = Number(s);
  return s && Number.isFinite(n) ? n : null;
}

// ---- merge: bloques de un solo registro ----------------------------------

const titleText = (clave, seccion) => async (v) => {
  const data = {};
  if ('title' in v) data.titulo = v.title;
  if ('text' in v) data.contenido = v.text;
  await upsertArticulo(clave, seccion, data);
};

async function syncPillars(titles) {
  const rows = await admin.list('articulos', { tipo: 'PILAR' });
  for (const [i, titulo] of titles.entries()) {
    if (rows[i]) await admin.update('articulos', rows[i].id, { titulo, orden: i + 1 });
    else await admin.create('articulos', { clave: `nosotros.pilar.${Date.now()}.${i}`, seccion: 'NOSOTROS', tipo: 'PILAR', titulo, orden: i + 1 });
  }
  for (const r of rows.slice(titles.length)) await admin.remove('articulos', r.id);
}

const mergers = {
  'home.site': (v) => admin.setConfig('site', { ...get('home', 'site'), ...v }),
  'home.hero': async (v) => {
    if ('tagline' in v) await upsertArticulo('home.eslogan', 'HOME', { contenido: v.tagline });
    if ('image' in v) await setSlotImage('home.hero', v.image);
  },
  'home.restaurant': async (v) => {
    await titleText('home.resto', 'HOME')(v);
    if ('image' in v) await setSlotImage('home.resto', v.image);
  },
  'about.who': titleText('nosotros.quienes', 'NOSOTROS'),
  'about.identity': async (v) => {
    if ('text' in v) await upsertArticulo('nosotros.identidad', 'NOSOTROS', { contenido: v.text });
    if ('pillars' in v) await syncPillars(v.pillars);
  },
  'restaurant.intro': titleText('resto.intro', 'RESTO'),
  'restaurant.proposal': titleText('resto.propuesta', 'RESTO'),
  'restaurant.info': (v) => admin.setConfig('resto.info', { ...get('restaurant', 'info'), ...v }),
};

// ---- Listas: se guardan / borran por elemento ------------------------------

const imageList = (section, path, slot) => ({
  save: (item) => {
    const body = { url: item.src, alt: item.alt ?? '' };
    return isId(item.id)
      ? admin.update('imagenes', item.id, body)
      : admin.create('imagenes', { ...body, slot, orden: (get(section, path) ?? []).length });
  },
  remove: (item) => admin.remove('imagenes', item.id),
});

async function guestIds(names) {
  const list = await admin.list('articulos', { tipo: 'INVITADO' });
  const ids = [];
  for (const raw of names) {
    const name = String(raw).trim();
    if (!name) continue;
    let g = list.find((a) => a.titulo.toLowerCase() === name.toLowerCase());
    if (!g) {
      g = await admin.create('articulos', {
        clave: `invitado.${Date.now()}.${ids.length}`, seccion: 'NOSOTROS', tipo: 'INVITADO', titulo: name, orden: list.length,
      });
      list.push(g);
    }
    ids.push(g.id);
  }
  return ids;
}

const eventList = (section) => ({
  async save(item) {
    const body = {
      nombre: item.name,
      fecha: item.date,
      descripcion: item.description ?? '',
      invitados: await guestIds(item.guests ?? []),
    };
    if (section === 'events') {
      Object.assign(body, {
        categoria: item.category || 'LIVE', tipo: item.type ?? '', lugar: item.location ?? '',
        destacado: !!item.featured, participacion: !!item.participation,
      });
    } else {
      Object.assign(body, { entradas: item.tickets || null, urlEntradas: item.url || null });
    }
    let row;
    if (isId(item.id)) row = await admin.update('eventos', item.id, body);
    else row = await admin.create('eventos', { ...body, slug: item.slug || slugify(item.name) });
    const urls = section === 'events' ? [item.image, ...(item.images ?? [])] : [item.image];
    await syncOwnerImages('eventoId', row.id, urls);
  },
  remove: (item) => admin.remove('eventos', item.id),
});

const dishCategoryName = (id) => (get('restaurant', 'categories') ?? []).find((c) => c.id === id)?.name ?? '';

const lists = {
  'about.history': {
    async save(item) {
      const data = { titulo: item.title, contenido: item.text ?? '', extra: { anio: item.year } };
      if (isId(item.id)) await admin.update('articulos', item.id, data);
      else {
        await admin.create('articulos', {
          ...data, clave: `nosotros.historia.${Date.now()}`, seccion: 'NOSOTROS', tipo: 'HISTORIA',
          orden: (get('about', 'history') ?? []).length + 1,
        });
      }
    },
    remove: (item) => admin.remove('articulos', item.id),
  },
  'about.space': imageList('about', 'space', 'about.space'),
  'restaurant.gallery': imageList('restaurant', 'gallery', 'resto.gallery'),
  'restaurant.space': imageList('restaurant', 'space', 'resto.space'),
  'gallery.items': imageList('gallery', 'items', 'gallery'),

  'guests.items': {
    async save(item) {
      const body = { titulo: item.name, subtitulo: item.category ?? '', contenido: item.description ?? '' };
      const row = isId(item.id)
        ? await admin.update('articulos', item.id, body)
        : await admin.create('articulos', {
          ...body, clave: `invitado.${Date.now()}`, seccion: 'NOSOTROS', tipo: 'INVITADO',
          orden: (get('guests', 'items') ?? []).length,
        });
      await syncOwnerImages('articuloId', row.id, [item.image]);
    },
    remove: (item) => admin.remove('articulos', item.id),
  },
  'events.items': eventList('events'),
  'upcoming.items': eventList('upcoming'),

  'restaurant.dishes': {
    async save(item) {
      const body = {
        nombre: item.name,
        descripcion: item.description ?? '',
        tipo: item.type || 'COMIDA',
        categorias: dishCategoryName(item.categoryId),
        precio: parsePrice(item.price),
      };
      const row = isId(item.id)
        ? await admin.update('alimentos', item.id, body)
        : await admin.create('alimentos', { ...body, orden: (get('restaurant', 'dishes') ?? []).length });
      await syncOwnerImages('alimentoId', row.id, [item.image]);
    },
    remove: (item) => admin.remove('alimentos', item.id),
  },

  // Las categorías no son una tabla: salen de los platos (+ las vacías en Configuracion "resto.categorias").
  'restaurant.categories': {
    async save(item) {
      const name = String(item.name).trim();
      const old = (get('restaurant', 'categories') ?? []).find((c) => c.id === item.id);
      const names = await configNames();
      if (!old) {
        await admin.setConfig('resto.categorias', [...names.filter((n) => slugify(n) !== slugify(name)), name]);
        return;
      }
      if (old.name === name) return;
      for (const d of get('restaurant', 'dishes') ?? []) {
        if (!d.categoryIds?.includes(old.id)) continue;
        const cats = d.categoryIds.map((id) => (id === old.id ? name : dishCategoryName(id)));
        await admin.update('alimentos', d.id, { categorias: cats.filter(Boolean).join(',') });
      }
      await admin.setConfig('resto.categorias', names.map((n) => (slugify(n) === old.id ? name : n)));
    },
    async remove(item) {
      for (const d of get('restaurant', 'dishes') ?? []) {
        if (!d.categoryIds?.includes(item.id)) continue;
        if (d.categoryId === item.id) await admin.remove('alimentos', d.id);
        else {
          const cats = d.categoryIds.filter((id) => id !== item.id).map(dishCategoryName);
          await admin.update('alimentos', d.id, { categorias: cats.filter(Boolean).join(',') });
        }
      }
      await admin.setConfig('resto.categorias', (await configNames()).filter((n) => slugify(n) !== item.id));
    },
  },
};

// Qué secciones hay que releer después de editar cada cosa.
const EVENT_SECTIONS = ['events', 'upcoming', 'guests'];
const affected = (section) => {
  if (section === 'events' || section === 'upcoming' || section === 'guests') return EVENT_SECTIONS;
  return [section];
};

function listOf(section, path) {
  const l = lists[`${section}.${path}`];
  if (!l) throw new Error(`Edición no soportada: ${section}.${path}`);
  return l;
}
const items = (section, path) => get(section, path) ?? [];
const done = (section, path) => loadSections(affected(section));

// ---- API que usan los componentes ----------------------------------------

// Mezcla `values` dentro del bloque en `path` (ej. 'hero' dentro de 'home').
export async function merge(section, path, values) {
  const m = mergers[`${section}.${path}`];
  if (!m) throw new Error(`Edición no soportada: ${section}.${path}`);
  await m(values);
  await loadSections([section]);
}

export async function pushItem(section, listPath, item) {
  await listOf(section, listPath).save({ ...item, id: undefined });
  await done(section, listPath);
}

export async function setAt(section, listPath, index, item) {
  const current = items(section, listPath)[index];
  if (!current) throw new Error('El elemento ya no existe.');
  await listOf(section, listPath).save({ ...current, ...item });
  await done(section, listPath);
}

export async function removeAt(section, listPath, index) {
  const current = items(section, listPath)[index];
  if (!current) throw new Error('El elemento ya no existe.');
  await listOf(section, listPath).remove(current);
  await done(section, listPath);
}

// Crea (si el id no existe en el servidor) o actualiza.
export async function upsertById(section, listPath, item) {
  const current = items(section, listPath).find((x) => x.id === item.id);
  await listOf(section, listPath).save(current ? { ...current, ...item } : { ...item, id: undefined, ...(item.slug ? { slug: item.slug } : {}) });
  await done(section, listPath);
}

export async function removeById(section, listPath, id) {
  const current = items(section, listPath).find((x) => x.id === id);
  if (!current) return;
  await listOf(section, listPath).remove(current);
  await done(section, listPath);
}

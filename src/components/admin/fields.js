// Definiciones de formularios del modo admin (los consumen EditButton / AddButton).

const t = (name, label, extra = {}) => ({ name, label, type: 'text', ...extra });
const ta = (name, label, extra = {}) => ({ name, label, type: 'textarea', ...extra });

export const tagline = [ta('tagline', 'Eslogan', { rows: 3, required: true })];
export const imageOnly = [{ name: 'image', label: 'Imagen', type: 'image' }];
export const titleText = [t('title', 'Título', { required: true }), ta('text', 'Texto', { rows: 6 })];
export const whoFields = titleText;
export const identityText = [ta('text', 'Texto de identidad', { rows: 5, required: true })];
export const pillarsField = [{
  name: 'pillars', label: 'Pilares', type: 'lines', rows: 5, hint: 'Uno por línea. Se muestran en la cinta animada.',
}];
export const historyFields = [
  t('year', 'Etiqueta (año / etapa)', { required: true }),
  t('title', 'Título', { required: true }),
  ta('text', 'Texto', { rows: 5 }),
];
export const guestFields = [
  t('name', 'Nombre', { required: true }),
  t('category', 'Categoría', { hint: 'Ej.: Banda, DJ, Spoken word' }),
  ta('description', 'Descripción', { rows: 4 }),
  { name: 'image', label: 'Foto', type: 'image' },
];
export const galleryImageFields = [
  { name: 'src', label: 'Imagen', type: 'image' },
  t('alt', 'Descripción de la imagen (alt)'),
];
export const categoryFields = [t('name', 'Nombre de la categoría', { required: true })];
export const infoFields = [
  ta('reservations', 'Reservas', { rows: 3 }),
  ta('note', 'Nota', { rows: 3 }),
];

export const dishFields = (categories = []) => [
  t('name', 'Nombre', { required: true }),
  {
    name: 'type', label: 'Tipo', type: 'select',
    options: [{ value: 'COMIDA', label: 'Comida' }, { value: 'BEBIDA', label: 'Bebida' }],
  },
  {
    name: 'categoryId', label: 'Categoría', type: 'select',
    options: categories.length ? categories.map((c) => ({ value: c.id, label: c.name })) : [{ value: '', label: '— creá una categoría primero —' }],
  },
  ta('description', 'Descripción', { rows: 3 }),
  t('price', 'Precio', { hint: 'Texto libre, ej. $4500. Vacío = sin precio.' }),
  { name: 'image', label: 'Imagen', type: 'image' },
];

export const eventFields = [
  t('name', 'Nombre', { required: true }),
  { name: 'date', label: 'Fecha', type: 'date', required: true },
  {
    name: 'category', label: 'Categoría', type: 'select',
    options: [{ value: 'LIVE', label: 'Live' }, { value: 'ARCHIVE', label: 'Archive' }, { value: 'FOOD', label: 'Food' }],
  },
  t('type', 'Tipo', { hint: 'Ej.: Recital, Fiesta, Ciclo' }),
  t('location', 'Lugar'),
  ta('description', 'Descripción', { rows: 5 }),
  { name: 'image', label: 'Imagen principal', type: 'image' },
  { name: 'images', label: 'Galería del evento', type: 'images' },
  { name: 'guests', label: 'Artistas e invitados', type: 'lines', rows: 4, hint: 'Uno por línea.' },
  { name: 'featured', label: 'Destacado', type: 'checkbox' },
  { name: 'participation', label: 'Participación en sede externa', type: 'checkbox' },
];

export const upcomingFields = [
  t('name', 'Nombre', { required: true }),
  { name: 'date', label: 'Fecha', type: 'date', required: true },
  ta('description', 'Descripción', { rows: 5 }),
  { name: 'image', label: 'Imagen', type: 'image' },
  { name: 'guests', label: 'Artistas e invitados', type: 'lines', rows: 4, hint: 'Uno por línea.' },
  t('tickets', 'Entradas', { hint: 'Ej.: Entradas: $3000 anticipadas' }),
  t('url', 'Enlace de más info', { type: 'url' }),
];

export const siteFields = [
  t('address', 'Dirección'),
  { ...t('email', 'Email'), type: 'email' },
  t('phone', 'Teléfono'),
  {
    name: 'hours', label: 'Horarios', type: 'lines', rows: 4,
    hint: 'Una línea por horario: días | horas. Ej.: Jueves a sábado | 20:00 — 03:00',
    format: (v = []) => v.map((h) => `${h.days} | ${h.time}`).join('\n'),
    parse: (s) => s.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
      const [days, ...rest] = l.split('|');
      return { days: days.trim(), time: rest.join('|').trim() };
    }),
  },
  {
    name: 'social', label: 'Redes', type: 'lines', rows: 4,
    hint: 'Una línea por red: nombre | enlace. Ej.: Instagram | https://instagram.com/…',
    format: (v = []) => v.map((s) => `${s.label} | ${s.url}`).join('\n'),
    parse: (s) => s.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
      const [label, ...rest] = l.split('|');
      return { label: label.trim(), url: rest.join('|').trim() || '#' };
    }),
  },
];

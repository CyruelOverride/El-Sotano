import { AddButton, AdminBar, DeleteButton, EditButton } from './AdminControls';
import { eventFields, upcomingFields } from './fields';
import { getState, uid } from '../../services/contentService';
import { removeById, slugify, upsertById } from '../../services/contentActions';

// Los "próximos" viven en la sección `upcoming` (category 'UPCOMING'); el resto en `events`.
const sectionOf = (e) => (e.category === 'UPCOMING' ? 'upcoming' : 'events');
const fieldsOf = (section) => (section === 'upcoming' ? upcomingFields : eventFields);

function uniqueSlug(name) {
  const s = getState();
  const taken = new Set([...(s.events?.items || []), ...(s.upcoming?.items || [])].map((e) => e.slug));
  const base = slugify(name) || uid('evento-');
  let slug = base;
  for (let n = 2; taken.has(slug); n += 1) slug = `${base}-${n}`;
  return slug;
}

const DEFAULTS = {
  events: { category: 'LIVE', type: '', location: '', description: '', image: null, images: [], guests: [], featured: false, participation: false },
  upcoming: { description: '', image: null, guests: [], tickets: '', url: '', category: 'UPCOMING' },
};

export function EventAdminBar({ event, onDeleted, className = '' }) {
  const section = sectionOf(event);
  return (
    <AdminBar className={className}>
      <EditButton
        title={`Editar: ${event.name}`}
        fields={fieldsOf(section)}
        value={event}
        onSave={(v) => upsertById(section, 'items', { ...v, id: event.id })}
      />
      <DeleteButton
        title={`Eliminar: ${event.name}`}
        message={`Se eliminará "${event.name}" junto con su información. Esta acción no se puede deshacer.`}
        onConfirm={() => { removeById(section, 'items', event.id); onDeleted?.(); }}
      />
    </AdminBar>
  );
}

// section: 'events' (archivo) | 'upcoming' (agenda)
export function EventAddButton({ section = 'events', label }) {
  return (
    <AddButton
      title={section === 'upcoming' ? 'Nuevo evento próximo' : 'Nuevo evento'}
      label={label || (section === 'upcoming' ? 'Agregar próximo evento' : 'Agregar evento')}
      fields={fieldsOf(section)}
      initial={DEFAULTS[section]}
      onSave={(v) => upsertById(section, 'items', { ...DEFAULTS[section], ...v, id: uid('e'), slug: uniqueSlug(v.name) })}
    />
  );
}

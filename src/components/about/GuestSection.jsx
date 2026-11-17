import SectionTitle from '../shared/SectionTitle';
import GuestCard from '../shared/GuestCard';
import Reveal from '../shared/Reveal';
import { useAuth } from '../../hooks/useAuth';
import { AddButton, AdminBar, DeleteButton, EditButton } from '../admin/AdminControls';
import { guestFields } from '../admin/fields';
import { removeById, upsertById } from '../../services/contentActions';
import { uid } from '../../services/contentService';

export default function GuestSection({ guests = [] }) {
  const { isAdmin } = useAuth();
  if (!guests.length && !isAdmin) return null;
  return (
    <section className="section">
      <SectionTitle number={4} label="Line-up histórico">Nuestros invitados</SectionTitle>
      <div className="guests">
        {guests.map((g, i) => (
          <Reveal key={g.id} delay={(i % 4) * 0.07}>
            <GuestCard guest={g} index={i} />
            <AdminBar>
              <EditButton title={`Editar: ${g.name}`} fields={guestFields} value={g} onSave={(v) => upsertById('guests', 'items', { ...v, id: g.id })} />
              <DeleteButton title={`Eliminar: ${g.name}`} message={`Se eliminará a "${g.name}" de los invitados.`} onConfirm={() => removeById('guests', 'items', g.id)} />
            </AdminBar>
          </Reveal>
        ))}
      </div>
      <AdminBar className="admin-bar--row">
        <AddButton
          title="Nuevo invitado"
          label="Agregar invitado"
          fields={guestFields}
          initial={{ name: '', category: '', description: '', image: null }}
          onSave={(v) => upsertById('guests', 'items', { ...v, id: uid('g'), eventId: null })}
        />
      </AdminBar>
    </section>
  );
}

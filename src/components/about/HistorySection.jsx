import SectionTitle from '../shared/SectionTitle';
import Reveal from '../shared/Reveal';
import { useAuth } from '../../hooks/useAuth';
import { AddButton, AdminBar, DeleteButton, EditButton } from '../admin/AdminControls';
import { historyFields } from '../admin/fields';
import { pushItem, removeAt, setAt } from '../../services/contentActions';

export default function HistorySection({ items = [] }) {
  const { isAdmin } = useAuth();
  if (!items.length && !isAdmin) return null;
  return (
    <section className="section">
      <SectionTitle number={2} label="Línea de tiempo">Nuestra historia</SectionTitle>
      <ol className="timeline">
        {items.map((it, i) => (
          <Reveal as="li" key={i} delay={i * 0.08} className="timeline__item">
            <span className="mono">{it.year}</span>
            <h3 className="display-s">{it.title}</h3>
            <div>
              <p>{it.text}</p>
              <AdminBar>
                <EditButton title={`Editar: ${it.title}`} fields={historyFields} value={it} onSave={(v) => setAt('about', 'history', i, v)} />
                <DeleteButton title={`Eliminar: ${it.title}`} message="Se quitará este hito de la historia." onConfirm={() => removeAt('about', 'history', i)} />
              </AdminBar>
            </div>
          </Reveal>
        ))}
      </ol>
      <AdminBar className="admin-bar--row">
        <AddButton title="Nuevo hito" label="Agregar hito" fields={historyFields} initial={{ year: '', title: '', text: '' }} onSave={(v) => pushItem('about', 'history', v)} />
      </AdminBar>
    </section>
  );
}

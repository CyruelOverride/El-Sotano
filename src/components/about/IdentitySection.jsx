import SectionTitle from '../shared/SectionTitle';
import Marquee from '../shared/Marquee';
import Reveal from '../shared/Reveal';
import { AdminBar, EditButton } from '../admin/AdminControls';
import { identityText, pillarsField } from '../admin/fields';
import { merge } from '../../services/contentActions';

export default function IdentitySection({ identity }) {
  if (!identity) return null;
  return (
    <section className="identity">
      <div className="section">
        <SectionTitle number={3} label="Filosofía" invert>Nuestra identidad</SectionTitle>
        <Reveal><p className="identity__text display-s">{identity.text}</p></Reveal>
        <AdminBar>
          <EditButton title="Editar identidad" label="Texto" fields={identityText} value={identity} onSave={(v) => merge('about', 'identity', v)} />
          <EditButton title="Editar pilares" label="Pilares" fields={pillarsField} value={identity} onSave={(v) => merge('about', 'identity', v)} />
        </AdminBar>
      </div>
      <Marquee items={identity.pillars || []} invert />
    </section>
  );
}

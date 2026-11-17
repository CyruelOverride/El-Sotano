import { useContent } from '../hooks/useContent';
import { usePageMeta } from '../hooks/usePageMeta';
import { useAuth } from '../hooks/useAuth';
import RestaurantHero from '../components/restaurant/RestaurantHero';
import MenuSection from '../components/restaurant/MenuSection';
import SectionTitle from '../components/shared/SectionTitle';
import ImageGallery from '../components/shared/ImageGallery';
import Reveal from '../components/shared/Reveal';
import { AdminBar, EditButton } from '../components/admin/AdminControls';
import SiteEditButton from '../components/admin/SiteEditButton';
import { infoFields, titleText } from '../components/admin/fields';
import { merge } from '../services/contentActions';
import { Loading, DemoBanner } from '../components/shared/StateViews';

export default function Restaurant() {
  usePageMeta('Resto', 'La propuesta gastronómica y el menú de El Sótano.');
  const { isAdmin } = useAuth();
  const { data, loading, isFallback } = useContent('restaurant', 'home');
  if (loading) return <Loading />;
  const r = data.restaurant || {};
  const site = data.home?.site;

  return (
    <>
      <DemoBanner show={isFallback} />
      <RestaurantHero intro={r.intro} />
      {(r.proposal || isAdmin) && (
        <section className="section proposal">
          <SectionTitle number={1} label="Cocina">{r.proposal?.title}</SectionTitle>
          <Reveal><p className="lead">{r.proposal?.text}</p></Reveal>
          <AdminBar>
            <EditButton title="Editar propuesta" label="Propuesta" fields={titleText} value={r.proposal} onSave={(v) => merge('restaurant', 'proposal', v)} />
          </AdminBar>
        </section>
      )}
      <MenuSection categories={r.categories} dishes={r.dishes} />
      {(r.gallery?.length > 0 || isAdmin) && (
        <section className="section">
          <SectionTitle number={3} label="Platos y bebidas">Galería gastronómica</SectionTitle>
          <ImageGallery images={r.gallery} admin={{ section: 'restaurant', path: 'gallery' }} />
        </section>
      )}
      {(r.space?.length > 0 || isAdmin) && (
        <section className="section">
          <SectionTitle number={4} label="Ambiente">El espacio</SectionTitle>
          <ImageGallery images={r.space} admin={{ section: 'restaurant', path: 'space' }} />
        </section>
      )}
      <section className="section info">
        <SectionTitle number={5} label="Datos">Información útil</SectionTitle>
        <div className="info__grid">
          <div><h3 className="mono">Horarios</h3>{site?.hours?.map((h, i) => <p key={i}>{h.days} — <span className="mono">{h.time}</span></p>)}</div>
          <div><h3 className="mono">Ubicación</h3><p>{site?.address}</p></div>
          <div><h3 className="mono">Contacto</h3>{site?.email && <p>{site.email}</p>}{site?.phone && <p>{site.phone}</p>}</div>
          {r.info?.reservations && <div><h3 className="mono">Reservas</h3><p>{r.info.reservations}</p></div>}
        </div>
        <AdminBar>
          <SiteEditButton site={site} />
          <EditButton title="Editar reservas" label="Reservas" fields={infoFields} value={r.info} onSave={(v) => merge('restaurant', 'info', v)} />
        </AdminBar>
      </section>
    </>
  );
}

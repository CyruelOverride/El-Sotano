import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { usePageMeta } from '../hooks/usePageMeta';
import { splitEvents } from '../utils';
import EventGrid from '../components/events/EventGrid';
import EventArchive from '../components/events/EventArchive';
import EventDetail from '../components/events/EventDetail';
import EventCard from '../components/events/EventCard';
import { AdminBar } from '../components/admin/AdminControls';
import { EventAddButton } from '../components/admin/EventAdmin';
import SectionTitle from '../components/shared/SectionTitle';
import ImageGallery from '../components/shared/ImageGallery';
import { Loading, DemoBanner } from '../components/shared/StateViews';

export default function Events() {
  const { slug } = useParams();
  const { data, loading, isFallback } = useContent('events', 'upcoming', 'gallery');
  const { archive } = useMemo(() => splitEvents(data.events?.items, data.upcoming?.items), [data]);
  const current = slug ? archive.find((e) => (e.slug || e.id) === slug) : null;

  usePageMeta(current ? current.name : 'Eventos', current ? current.description : 'Archivo de la actividad cultural de El Sótanoooo.');
  if (loading) return <Loading />;

  if (slug) {
    return current ? (
      <><DemoBanner show={isFallback} /><EventDetail event={current} /></>
    ) : (
      <section className="page-head"><h1 className="display">No encontrado</h1><Link to="/eventos" className="btn btn--invert">← Volver a Eventos</Link></section>
    );
  }

  const featured = archive.filter((e) => e.featured);
  const participations = archive.filter((e) => e.participation);
  const galleryImgs = [
    ...archive.flatMap((e) => (e.images || []).map((s) => (typeof s === 'string' ? { src: s, alt: e.name } : s))),
    ...(data.gallery?.items || []),
  ];

  return (
    <>
      <DemoBanner show={isFallback} />
      <section className="page-head">
        <span className="mono">Archivo / {archive.length} eventos</span>
        <h1 className="display">Eventos</h1>
        <AdminBar><EventAddButton section="events" /></AdminBar>
      </section>
      {featured.length > 0 && (
        <section className="section">
          <SectionTitle number={1} label="Destacados">Eventos destacados</SectionTitle>
          <EventGrid events={featured} />
        </section>
      )}
      <section className="section">
        <SectionTitle number={2} label="Cronología">Archivo de eventos</SectionTitle>
        <EventArchive events={archive} />
      </section>
      {participations.length > 0 && (
        <section className="section">
          <SectionTitle number={3} label="Afuera">Participaciones</SectionTitle>
          <div className="featured-events">
            {participations.map((e, i) => <EventCard key={e.id} event={e} index={i} variant="small" />)}
          </div>
        </section>
      )}
      {galleryImgs.length > 0 && (
        <section className="section">
          <SectionTitle number={4} label="Material">Galería</SectionTitle>
          <ImageGallery images={galleryImgs} />
        </section>
      )}
    </>
  );
}

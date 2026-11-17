import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { usePageMeta } from '../hooks/usePageMeta';
import { splitEvents } from '../utils';
import Hero from '../components/home/Hero';
import FeaturedEvents from '../components/home/FeaturedEvents';
import RestaurantPreview from '../components/home/RestaurantPreview';
import GalleryPreview from '../components/home/GalleryPreview';
import FeaturedUpcoming from '../components/upcoming/FeaturedUpcoming';
import UpcomingList from '../components/upcoming/UpcomingList';
import SectionTitle from '../components/shared/SectionTitle';
import Marquee from '../components/shared/Marquee';
import { Loading, DemoBanner } from '../components/shared/StateViews';

export default function Home() {
  usePageMeta('Inicio', 'ElSotano: bar con restaurante, música en vivo y cultura underground.');
  const { data, loading, isFallback } = useContent('home', 'events', 'upcoming', 'gallery');

  const { archive, next } = useMemo(() => splitEvents(data.events?.items, data.upcoming?.items), [data]);
  if (loading) return <Loading />;

  const featured = (archive.filter((e) => e.featured).length ? archive.filter((e) => e.featured) : archive).slice(0, 3);

  return (
    <>
      <DemoBanner show={isFallback} />
      <Hero hero={data.home?.hero} />
      <Marquee items={['Música en vivo', 'Resto', 'Underground', 'Eventos']} />
      <div id="contenido" />
      <FeaturedEvents events={featured} />
      <RestaurantPreview restaurant={data.home?.restaurant} />
      {next.length > 0 && (
        <section className="section">
          <SectionTitle number={3} label="Agenda">Próximamente</SectionTitle>
          <FeaturedUpcoming event={next[0]} />
          <UpcomingList events={next.slice(1, 4)} />
          <Link to="/proximamente" className="btn btn--invert more">Ver agenda completa →</Link>
        </section>
      )}
      <GalleryPreview images={data.gallery?.items} />
    </>
  );
}

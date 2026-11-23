import { useMemo } from 'react';
import { useContent } from '../hooks/useContent';
import { usePageMeta } from '../hooks/usePageMeta';
import { splitEvents } from '../utils';
import FeaturedUpcoming from '../components/upcoming/FeaturedUpcoming';
import UpcomingList from '../components/upcoming/UpcomingList';
import { AdminBar } from '../components/admin/AdminControls';
import { EventAddButton } from '../components/admin/EventAdmin';
import Banner from '../components/shared/Banner';
import SectionTitle from '../components/shared/SectionTitle';
import Marquee from '../components/shared/Marquee';
import { Loading, DemoBanner } from '../components/shared/StateViews';

export default function Upcoming() {
  usePageMeta('Próximamente', 'Agenda de los próximos eventos de El Sótano.');
  const { data, loading, isFallback } = useContent('upcoming', 'events');
  const { next } = useMemo(() => splitEvents(data.events?.items, data.upcoming?.items), [data]);
  if (loading) return <Loading />;

  const guests = [...new Set(next.flatMap((e) => e.guests || []))];

  return (
    <>
      <DemoBanner show={isFallback} />
      <section className="page-head">
        <span className="mono">Agenda</span>
        <h1 className="display">Próximamente</h1>
        <AdminBar><EventAddButton section="upcoming" /></AdminBar>
      </section>
      <Banner slot="upcoming-1" label="Banner próximamente" />
      {next.length === 0 ? (
        <section className="section"><p className="lead">No hay eventos confirmados por ahora. Volvé pronto.</p></section>
      ) : (
        <>
          <section className="section"><FeaturedUpcoming event={next[0]} /></section>
          {next.length > 1 && (
            <section className="section">
              <SectionTitle number={2} label="Cronológico">Agenda</SectionTitle>
              <UpcomingList events={next.slice(1)} />
            </section>
          )}
          {guests.length > 0 && (
            <section className="guestsband">
              <SectionTitle number={3} label="Confirmados" invert>Artistas invitados</SectionTitle>
              <Marquee items={guests} invert />
            </section>
          )}
        </>
      )}
    </>
  );
}

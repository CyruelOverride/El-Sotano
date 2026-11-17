import { Link } from 'react-router-dom';
import EventCard from '../events/EventCard';
import SectionTitle from '../shared/SectionTitle';

export default function FeaturedEvents({ events }) {
  if (!events.length) return null;
  const variants = ['large', 'small', 'small'];
  return (
    <section className="section">
      <SectionTitle number={1} label="Archivo">Últimos eventos</SectionTitle>
      <div className="featured-events">
        {events.map((e, i) => <EventCard key={e.id} event={e} index={i} variant={variants[i % 3]} />)}
      </div>
      <Link to="/eventos" className="btn btn--invert more">Ver todos los eventos →</Link>
    </section>
  );
}

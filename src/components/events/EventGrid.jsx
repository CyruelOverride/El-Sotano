import EventCard from './EventCard';

const PATTERN = ['large', 'small', 'tall', 'text', 'small', 'large'];

// Grilla editorial asimétrica: alterna tamaños y bloques tipográficos.
export default function EventGrid({ events }) {
  return (
    <div className="egrid">
      {events.map((e, i) => <EventCard key={e.id} event={e} index={i} variant={PATTERN[i % PATTERN.length]} />)}
    </div>
  );
}

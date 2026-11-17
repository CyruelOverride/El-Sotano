import Photo from '../shared/Photo';
import Tag from '../shared/Tag';
import { formatDate } from '../../utils';
import { EventAdminBar } from '../admin/EventAdmin';

// Evento principal estilo flyer / cartel punk.
export default function FeaturedUpcoming({ event }) {
  const d = formatDate(event.date);
  return (
    <article className="flyer">
      <div className="flyer__date" aria-label={d.full}>
        <span className="display">{d.day}</span>
        <span className="display">{d.month}</span>
        <span className="mono">{d.year}</span>
      </div>
      <Photo src={event.image} alt={event.name} label={event.name} className="flyer__photo" ratio="3 / 4" eager />
      <div className="flyer__body">
        <Tag invert sticker>PRÓXIMO</Tag>
        <h2 className="display">{event.name}</h2>
        <p className="lead">{event.description}</p>
        {event.guests?.length > 0 && (
          <p className="flyer__guests display-s">{event.guests.join(' ✕ ')}</p>
        )}
        {event.tickets && <p className="mono">{event.tickets}</p>}
        {event.url && <a className="btn btn--invert" href={event.url} target="_blank" rel="noreferrer">Más info ↗</a>}
        <EventAdminBar event={event} />
      </div>
    </article>
  );
}

import Photo from '../shared/Photo';
import Reveal from '../shared/Reveal';
import { formatDate } from '../../utils';
import { EventAdminBar } from '../admin/EventAdmin';

export default function UpcomingEventCard({ event, index = 0 }) {
  const d = formatDate(event.date);
  return (
    <Reveal className="ucard" delay={(index % 3) * 0.08}>
      <div className="ucard__date"><b className="display">{d.day}</b><span className="mono">{d.month} {d.year}</span></div>
      <Photo src={event.image} alt={event.name} label={event.name} ratio="4 / 3" />
      <div className="ucard__body">
        <h3 className="display-s">{event.name}</h3>
        <p>{event.description}</p>
        {event.url && <a className="mono" href={event.url} target="_blank" rel="noreferrer">Info ↗</a>}
        <EventAdminBar event={event} />
      </div>
    </Reveal>
  );
}

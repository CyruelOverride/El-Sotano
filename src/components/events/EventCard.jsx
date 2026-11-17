import { Link } from 'react-router-dom';
import Photo from '../shared/Photo';
import Tag from '../shared/Tag';
import Reveal from '../shared/Reveal';
import { formatDate, pad } from '../../utils';
import { EventAdminBar } from '../admin/EventAdmin';

// variant: 'large' | 'small' | 'tall' | 'text'
export default function EventCard({ event, variant = 'small', index = 0 }) {
  const d = formatDate(event.date);
  const to = `/eventos/${event.slug || event.id}`;

  if (variant === 'text') {
    return (
      <Reveal className={`ecard ecard--text`} delay={(index % 3) * 0.08}>
        <Link to={to} className="ecard__link">
          <span className="ecard__num display">{pad(index + 1)}</span>
          <Tag invert>{event.category}</Tag>
          <h3 className="display-s">{event.name}</h3>
          <p className="mono">{d.full}</p>
        </Link>
        <EventAdminBar event={event} className="admin-bar--corner" />
      </Reveal>
    );
  }

  return (
    <Reveal className={`ecard ecard--${variant}`} delay={(index % 3) * 0.08}>
      <Link to={to} className="ecard__link">
        <Photo src={event.image} alt={event.name} label={event.name} className="ecard__photo" />
        <span className="ecard__date mono"><b>{d.day}</b>{d.month} {d.year}</span>
        <div className="ecard__body">
          <span className="ecard__num mono">№ {pad(index + 1)}</span>
          {event.category && <Tag sticker>{event.category}</Tag>}
          <h3 className="display-s">{event.name}</h3>
          {event.description && <p>{event.description}</p>}
        </div>
      </Link>
      <EventAdminBar event={event} className="admin-bar--corner" />
    </Reveal>
  );
}

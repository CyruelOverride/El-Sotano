import { Link, useNavigate } from 'react-router-dom';
import Photo from '../shared/Photo';
import Tag from '../shared/Tag';
import ImageGallery from '../shared/ImageGallery';
import { formatDate } from '../../utils';
import { EventAdminBar } from '../admin/EventAdmin';

export default function EventDetail({ event }) {
  const navigate = useNavigate();
  const d = formatDate(event.date);
  const images = (event.images || []).map((s) => (typeof s === 'string' ? { src: s, alt: event.name } : s));

  return (
    <article className="edetail">
      <Link to="/eventos" className="mono edetail__back">← Volver al archivo</Link>
      <EventAdminBar event={event} onDeleted={() => navigate('/eventos')} className="admin-bar--row" />
      <div className="edetail__head">
        <div>
          <div className="edetail__tags">{event.category && <Tag invert>{event.category}</Tag>}{event.type && <Tag>{event.type}</Tag>}</div>
          <h1 className="display">{event.name}</h1>
          <p className="mono edetail__meta">{d.full}{event.location ? ` — ${event.location}` : ''}</p>
        </div>
        <Photo src={event.image} alt={event.name} label={event.name} ratio="4 / 5" eager />
      </div>
      <div className="edetail__body">
        <p className="lead">{event.description}</p>
        {event.guests?.length > 0 && (
          <aside>
            <h2 className="mono">Artistas e invitados</h2>
            <ul>{event.guests.map((g) => <li key={g} className="display-s">{g}</li>)}</ul>
          </aside>
        )}
      </div>
      <ImageGallery images={images} />
    </article>
  );
}

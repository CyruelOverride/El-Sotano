import Photo from './Photo';
import Tag from './Tag';

export default function GuestCard({ guest, index = 0 }) {
  return (
    <article className="guest">
      <Photo src={guest.image} alt={guest.name} label={guest.name} ratio="3 / 4" />
      <div className="guest__body">
        <span className="mono guest__num">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="display-s">{guest.name}</h3>
        {guest.category && <Tag>{guest.category}</Tag>}
        {guest.description && <p>{guest.description}</p>}
      </div>
    </article>
  );
}

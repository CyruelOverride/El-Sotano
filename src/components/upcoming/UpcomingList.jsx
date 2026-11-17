import UpcomingEventCard from './UpcomingEventCard';

export default function UpcomingList({ events }) {
  if (!events.length) return null;
  return <div className="ulist">{events.map((e, i) => <UpcomingEventCard key={e.id} event={e} index={i} />)}</div>;
}

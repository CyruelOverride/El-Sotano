import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EventFilters from './EventFilters';
import Tag from '../shared/Tag';
import { formatDate, byDateDesc } from '../../utils';
import { EventAdminBar } from '../admin/EventAdmin';

const uniq = (arr) => [...new Set(arr.filter(Boolean))];

export default function EventArchive({ events }) {
  const [filters, setFilters] = useState({ year: '', category: '', type: '' });

  const options = useMemo(() => ({
    years: uniq(events.map((e) => formatDate(e.date).year)).sort().reverse(),
    categories: uniq(events.map((e) => e.category)),
    types: uniq(events.map((e) => e.type)),
  }), [events]);

  const list = useMemo(() => events
    .filter((e) => (!filters.year || formatDate(e.date).year === filters.year)
      && (!filters.category || e.category === filters.category)
      && (!filters.type || e.type === filters.type))
    .sort(byDateDesc), [events, filters]);

  return (
    <div>
      <EventFilters filters={filters} options={options} onChange={setFilters} />
      <p className="mono archive__count" aria-live="polite">{list.length} resultado{list.length === 1 ? '' : 's'}</p>
      <ol className="archive">
        {list.map((e) => {
          const d = formatDate(e.date);
          return (
            <li key={e.id}>
              <Link to={`/eventos/${e.slug || e.id}`} className="archive__row">
                <span className="mono archive__date">{d.full}</span>
                <span className="display-s archive__name">{e.name}</span>
                <span className="archive__tags">{e.category && <Tag>{e.category}</Tag>}{e.type && <span className="mono">{e.type}</span>}</span>
                <span className="archive__arrow" aria-hidden="true">→</span>
              </Link>
              <EventAdminBar event={e} />
            </li>
          );
        })}
        {!list.length && <li className="archive__empty mono">Sin eventos para este filtro.</li>}
      </ol>
    </div>
  );
}

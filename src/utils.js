const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export const parseDate = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`) : null);

export function formatDate(d) {
  const date = parseDate(d);
  if (!date || isNaN(date)) return { day: '--', month: '---', year: '----', full: '' };
  const day = String(date.getDate()).padStart(2, '0');
  return {
    day,
    month: MONTHS[date.getMonth()],
    year: String(date.getFullYear()),
    full: `${day}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`,
  };
}

const today = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
};
export const isUpcoming = (d) => !!d && String(d).slice(0, 10) >= today();
export const byDateAsc = (a, b) => String(a.date).localeCompare(String(b.date));
export const byDateDesc = (a, b) => String(b.date).localeCompare(String(a.date));
export const pad = (n) => String(n).padStart(2, '0');

// Próximos = fecha futura. Los que ya pasaron se suman al archivo de eventos.
export function splitEvents(events = [], upcoming = []) {
  const ids = new Set(events.map((e) => e.id));
  const archive = [...events, ...upcoming.filter((u) => !isUpcoming(u.date) && !ids.has(u.id))].sort(byDateDesc);
  const next = upcoming.filter((u) => isUpcoming(u.date)).sort(byDateAsc);
  return { archive, next };
}

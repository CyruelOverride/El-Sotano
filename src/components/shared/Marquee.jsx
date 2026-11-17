export default function Marquee({ items, invert = false }) {
  const row = items.filter(Boolean);
  if (!row.length) return null;
  const content = [...row, ...row, ...row, ...row];
  return (
    <div className={`marquee${invert ? ' marquee--invert' : ''}`} aria-hidden="true">
      <div className="marquee__track">
        {content.map((t, i) => <span key={i}>{t} <b>✕</b></span>)}
      </div>
    </div>
  );
}

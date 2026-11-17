import Reveal from './Reveal';

export default function SectionTitle({ number, label, children, invert = false }) {
  return (
    <header className={`section-title${invert ? ' section-title--invert' : ''}`}>
      <Reveal>
        <div className="section-title__meta">
          {number != null && <span className="section-title__num">{String(number).padStart(2, '0')}</span>}
          {label && <span className="mono">{label}</span>}
          <span className="section-title__rule" />
        </div>
        <h2 className="display">{children}</h2>
      </Reveal>
    </header>
  );
}

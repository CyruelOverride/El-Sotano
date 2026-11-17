// Logo textual: letras alternando blanco/negro sobre negro/blanco.
export default function Logo({ size = 'md' }) {
  return (
    <span className={`logo logo--${size}`} aria-label="ElSotano">
      {'ElSotano'.split('').map((c, i) => (
        <span key={i} className={i % 2 === 0 ? 'logo__l logo__l--dark' : 'logo__l logo__l--light'} aria-hidden="true">{c}</span>
      ))}
    </span>
  );
}

// Logo textual estilo "ransom note" punk + diario: cada letra con otra tipografía
// (Fraktur, Bodoni, Playfair, Anton), alternando blanco/negro sobre negro/blanco.
const FONTS = ['geometric', 'geometric', 'geometric', 'geometric'];
// Letras que se dibujan solo con contorno (sin relleno).
const OUTLINE = new Set([0, 4, 7]);
const TILT = [-3, 2, -1, 3, -2, 1, -3, 2, -1];

export default function Logo({ size = 'md' }) {
  return (
    <span className={`logo logo--${size}`} aria-label="El Sótano">
      {'El Sótano'.split('').map((c, i) =>
        c === ' ' ? (
          <span key={i} className="logo__sp" aria-hidden="true" />
        ) : (
          <span
            key={i}
            className={`logo__l logo__l--${i % 2 === 0 ? 'dark' : 'light'} logo__f--${FONTS[i % FONTS.length]}${OUTLINE.has(i) ? ' logo__l--outline' : ''}`}
            style={{ transform: `rotate(${TILT[i % TILT.length]}deg)` }}
            aria-hidden="true"
          >{c}</span>
        )
      )}
    </span>
  );
}

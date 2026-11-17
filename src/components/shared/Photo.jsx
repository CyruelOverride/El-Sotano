import GrainOverlay from './GrainOverlay';

// Fotografía con tratamiento B/N + grano. Sin `src` muestra un placeholder visual.
export default function Photo({ src, alt = '', label, ratio, className = '', eager = false }) {
  return (
    <div className={`photo ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {src ? (
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      ) : (
        <div className="photo__ph" role="img" aria-label={alt || 'Imagen pendiente'}>
          <span className="mono">{label || alt || 'FOTO'}</span>
        </div>
      )}
      <GrainOverlay />
      <div className="photo__shade" aria-hidden="true" />
    </div>
  );
}

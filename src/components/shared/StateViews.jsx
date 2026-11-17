export function Loading() {
  return <div className="loading mono" role="status" aria-live="polite">CARGANDO<span>_</span></div>;
}

export function DemoBanner({ show }) {
  if (!show) return null;
  return <div className="demo-banner mono">CONTENIDO DE DEMOSTRACIÓN — el servidor no devolvió datos</div>;
}

export default function GrainOverlay({ fixed = false }) {
  return <div className={`grain${fixed ? ' grain--fixed' : ''}`} aria-hidden="true" />;
}

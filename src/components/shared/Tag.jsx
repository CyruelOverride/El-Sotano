export default function Tag({ children, invert = false, sticker = false }) {
  return <span className={`tag${invert ? ' tag--invert' : ''}${sticker ? ' tag--sticker' : ''}`}>{children}</span>;
}

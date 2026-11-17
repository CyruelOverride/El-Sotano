import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

// Diálogo accesible: Esc y click afuera cierran, foco atrapado, scroll del body bloqueado.
export default function Modal({ title, onClose, children, footer, wide = false }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () => ref.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? [];
    (ref.current?.querySelector('input, textarea, select') || focusables()[0])?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      if (e.key === 'Tab') {
        const list = [...focusables()].filter((el) => !el.disabled);
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`modal${wide ? ' modal--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="modal__head">
          <h2 id={titleId} className="display-s">{title}</h2>
          <button type="button" className="modal__x mono" onClick={onClose} aria-label="Cerrar">✕</button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import { useAuth } from '../../hooks/useAuth';
import { AddButton, AdminBar, DeleteButton, EditButton } from '../admin/AdminControls';
import { galleryImageFields } from '../admin/fields';
import { pushItem, removeAt, setAt } from '../../services/contentActions';

const needSrc = (v) => {
  if (!v.src) throw new Error('Elegí una imagen (URL o archivo).');
  return v;
};

// Galería con lightbox y navegación (flechas, teclado, Esc).
// `admin={{ section, path }}` habilita alta, edición y baja de imágenes para el admin.
export default function ImageGallery({ images = [], variant = 'mosaic', admin }) {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(null);
  const closeBtn = useRef(null);
  const withSrc = images.filter((i) => i.src);
  const canEdit = isAdmin && admin;

  const step = useCallback((d) => setOpen((o) => (o + d + withSrc.length) % withSrc.length), [withSrc.length]);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, step]);

  if (!images.length && !canEdit) return null;

  return (
    <>
      <div className={`gallery gallery--${variant}`}>
        {images.map((img, i) => {
          const idx = withSrc.indexOf(img);
          const photo = <Photo src={img.src} alt={img.alt} label={img.alt} />;
          return (
            <div key={i} className={`gallery__item g${i % 6}`}>
              {img.src ? (
                <button type="button" className="gallery__open" onClick={() => setOpen(idx)} aria-label={`Ampliar: ${img.alt || 'foto'}`}>
                  {photo}
                </button>
              ) : photo}
              {canEdit && (
                <AdminBar className="admin-bar--corner">
                  <EditButton
                    title="Editar imagen"
                    label="Imagen"
                    fields={galleryImageFields}
                    value={img}
                    onSave={(v) => setAt(admin.section, admin.path, i, needSrc({ ...img, ...v }))}
                  />
                  <DeleteButton
                    title="Eliminar imagen"
                    label="Quitar"
                    message="La imagen se quitará de esta galería."
                    onConfirm={() => removeAt(admin.section, admin.path, i)}
                  />
                </AdminBar>
              )}
            </div>
          );
        })}
      </div>

      {canEdit && (
        <AdminBar className="admin-bar--row">
          <AddButton
            title="Nueva imagen"
            label="Agregar imagen"
            fields={galleryImageFields}
            initial={{ src: null, alt: '' }}
            onSave={(v) => pushItem(admin.section, admin.path, needSrc(v))}
          />
        </AdminBar>
      )}

      {open != null && withSrc[open] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galería ampliada" onClick={() => setOpen(null)}>
          <button ref={closeBtn} className="lightbox__close mono" onClick={() => setOpen(null)}>CERRAR ✕</button>
          {withSrc.length > 1 && (
            <>
              <button className="lightbox__nav lightbox__nav--prev" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); step(-1); }}>←</button>
              <button className="lightbox__nav lightbox__nav--next" aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); step(1); }}>→</button>
            </>
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={withSrc[open].src} alt={withSrc[open].alt || ''} />
            <figcaption className="mono">{String(open + 1).padStart(2, '0')} / {String(withSrc.length).padStart(2, '0')} {withSrc[open].alt && `— ${withSrc[open].alt}`}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

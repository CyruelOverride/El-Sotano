import { useState } from 'react';

const MAX_BYTES = 3 * 1024 * 1024;

// Imagen por URL o subiendo un archivo (queda como data URL en memoria hasta que exista el backend).
export function ImageField({ value, onChange, id }) {
  const [error, setError] = useState('');

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('El archivo debe ser una imagen.');
    if (file.size > MAX_BYTES) return setError('La imagen supera los 3 MB.');
    setError('');
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.onerror = () => setError('No se pudo leer el archivo.');
    reader.readAsDataURL(file);
  };

  const isData = typeof value === 'string' && value.startsWith('data:');

  return (
    <div className="imgfield">
      {value ? <img className="imgfield__preview" src={value} alt="Vista previa" /> : <div className="imgfield__preview imgfield__preview--empty mono">SIN IMAGEN</div>}
      <input
        id={id}
        type="text"
        inputMode="url"
        placeholder="https://… (URL de la imagen)"
        value={isData ? '' : value || ''}
        onChange={(e) => onChange(e.target.value.trim() || null)}
      />
      <div className="imgfield__actions">
        <label className="admin-btn admin-btn--solid">
          Subir archivo
          <input type="file" accept="image/*" onChange={onFile} hidden />
        </label>
        {value && <button type="button" className="admin-btn" onClick={() => onChange(null)}>Quitar</button>}
        {isData && <span className="mono imgfield__note">archivo cargado</span>}
      </div>
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}

// Lista de imágenes (strings) con alta y baja.
export function ImageListField({ value = [], onChange }) {
  const set = (i, v) => onChange(value.map((x, j) => (j === i ? v ?? '' : x)));
  return (
    <div className="imglist">
      {value.map((src, i) => (
        <div key={i} className="imglist__row">
          <ImageField value={src} onChange={(v) => set(i, v)} />
          <button type="button" className="admin-btn admin-btn--danger" onClick={() => onChange(value.filter((_, j) => j !== i))}>Eliminar esta imagen</button>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--solid" onClick={() => onChange([...value, ''])}>＋ Agregar imagen</button>
    </div>
  );
}

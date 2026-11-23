import { useId, useState } from 'react';
import Modal from './Modal';
import { ImageField, ImageListField } from './ImageField';
import { useAuth } from '../../hooks/useAuth';

/*
 * Botones de administración. Solo se renderizan si hay sesión de admin, y TODOS abren un modal.
 *
 * Definición de campos: { name, label, type, required, options, rows, hint, format, parse }
 *   type: text | textarea | date | number | select | checkbox | image | images | lines
 *   lines: en pantalla es un textarea (una fila por elemento); `format(valor) → texto`, `parse(texto) → valor`.
 */

const toForm = (fields, initial = {}) =>
  Object.fromEntries(fields.map((f) => {
    const v = initial[f.name];
    if (f.type === 'lines') return [f.name, f.format ? f.format(v) : (v ?? []).join('\n')];
    if (f.type === 'checkbox') return [f.name, !!v];
    if (f.type === 'images') return [f.name, v ?? []];
    return [f.name, v ?? ''];
  }));

const fromForm = (fields, values) =>
  Object.fromEntries(fields.map((f) => {
    const v = values[f.name];
    if (f.type === 'lines') return [f.name, f.parse ? f.parse(v) : v.split('\n').map((s) => s.trim()).filter(Boolean)];
    if (f.type === 'images') return [f.name, v.filter(Boolean)];
    if (f.type === 'number') return [f.name, v === '' ? null : Number(v)];
    if (f.type === 'text' || f.type === 'textarea') return [f.name, v.trim()];
    if (f.type === 'image') return [f.name, v || null];
    return [f.name, v];
  }));

function Field({ field, value, onChange }) {
  const id = useId();
  const common = { id, required: field.required, value, onChange: (e) => onChange(e.target.value) };
  let control;
  switch (field.type) {
    case 'textarea':
    case 'lines':
      control = <textarea {...common} rows={field.rows || (field.type === 'lines' ? 5 : 4)} />;
      break;
    case 'select':
      control = (
        <select {...common}>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    case 'checkbox':
      control = <input id={id} type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />;
      break;
    case 'image':
      control = <ImageField id={id} value={value} onChange={onChange} />;
      break;
    case 'images':
      control = <ImageListField value={value} onChange={onChange} />;
      break;
    default:
      control = <input {...common} type={field.type || 'text'} step={field.type === 'number' ? 'any' : undefined} />;
  }
  const inline = field.type === 'checkbox';
  return (
    <div className={`field${inline ? ' field--inline' : ''}`}>
      <label htmlFor={id} className="mono">{field.label}{field.required && ' *'}</label>
      {control}
      {field.hint && <p className="field__hint">{field.hint}</p>}
    </div>
  );
}

function FormModal({ title, fields, initial, submitLabel = 'Guardar', onSubmit, onClose }) {
  const [values, setValues] = useState(() => toForm(fields, initial));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit(fromForm(fields, values));
      onClose();
    } catch (err) {
      setError(err.message || 'No se pudo guardar.');
      setBusy(false);
    }
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      wide={fields.some((f) => f.type === 'images')}
      footer={(
        <>
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button type="submit" form="admin-form" className="btn btn--invert" disabled={busy}>{busy ? 'Guardando…' : submitLabel}</button>
        </>
      )}
    >
      <form id="admin-form" onSubmit={submit} className="adminform">
        {fields.map((f) => (
          <Field key={f.name} field={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
        ))}
        {error && <p className="field__error" role="alert">{error}</p>}
      </form>
    </Modal>
  );
}

function ConfirmModal({ title, message, confirmLabel = 'Eliminar', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar.');
      setBusy(false);
    }
  };
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn btn--danger" onClick={confirm} disabled={busy}>{busy ? 'Eliminando…' : confirmLabel}</button>
        </>
      )}
    >
      <p>{message}</p>
      {error && <p className="field__error" role="alert">{error}</p>}
    </Modal>
  );
}

const cls = (corner, extra) => `admin-btn${corner ? ' admin-btn--corner' : ''}${extra ? ` ${extra}` : ''}`;

// Edita valores existentes: abre un modal con el formulario.
export function EditButton({ title, fields, value, onSave, label = 'Editar', corner = false, className }) {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  if (!isAdmin) return null;
  return (
    <>
      <button type="button" className={cls(corner, className)} onClick={() => setOpen(true)} aria-label={`${label}: ${title}`}>✎ {label}</button>
      {open && <FormModal title={title} fields={fields} initial={value} onSubmit={onSave} onClose={() => setOpen(false)} />}
    </>
  );
}

// Crea un elemento nuevo: mismo modal, con valores iniciales opcionales.
export function AddButton({ title, fields, initial, onSave, label = 'Agregar', corner = false, className }) {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  if (!isAdmin) return null;
  return (
    <>
      <button type="button" className={cls(corner, `admin-btn--solid ${className || ''}`)} onClick={() => setOpen(true)}>＋ {label}</button>
      {open && <FormModal title={title} fields={fields} initial={initial} submitLabel="Crear" onSubmit={onSave} onClose={() => setOpen(false)} />}
    </>
  );
}

// Elimina: pide confirmación en un modal.
export function DeleteButton({ title, message, onConfirm, label = 'Eliminar', corner = false, className }) {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  if (!isAdmin) return null;
  return (
    <>
      <button type="button" className={cls(corner, `admin-btn--danger ${className || ''}`)} onClick={() => setOpen(true)} aria-label={`${label}: ${title}`}>✕ {label}</button>
      {open && <ConfirmModal title={title} message={message || 'Esta acción no se puede deshacer.'} onConfirm={onConfirm} onClose={() => setOpen(false)} />}
    </>
  );
}

// Contenedor para agrupar botones de un bloque.
export function AdminBar({ children, className = '' }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return <div className={`admin-bar ${className}`}>{children}</div>;
}

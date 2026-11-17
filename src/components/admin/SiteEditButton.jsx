import { EditButton } from './AdminControls';
import { siteFields } from './fields';
import { merge } from '../../services/contentActions';

// Datos del local (dirección, contacto, horarios, redes). Se usa en el footer y en Resto.
export default function SiteEditButton({ site, label = 'Editar datos del local', className }) {
  return (
    <EditButton
      title="Datos del local"
      label={label}
      fields={siteFields}
      value={site}
      className={className}
      onSave={(v) => merge('home', 'site', v)}
    />
  );
}

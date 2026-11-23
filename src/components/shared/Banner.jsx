import Photo from './Photo';
import { AdminBar, EditButton } from '../admin/AdminControls';
import { imageOnly } from '../admin/fields';
import { useContent } from '../../hooks/useContent';
import { useAuth } from '../../hooks/useAuth';
import { merge } from '../../services/contentActions';

// Banner de imagen editable por el admin. `slot` identifica el lugar (se guarda en home.site.banners).
export default function Banner({ slot, label = 'BANNER', ratio = '21 / 8', className = '' }) {
  const { isAdmin } = useAuth();
  const { data } = useContent('home');
  const site = data.home?.site || {};
  const banners = site.banners || {};
  const image = banners[slot];
  if (!image && !isAdmin) return null;
  return (
    <section className={`banner ${className}`}>
      <Photo src={image} alt={label} label={`${label} — imagen`} ratio={ratio} />
      <AdminBar>
        <EditButton
          title={`Editar banner: ${label}`}
          label="Imagen del banner"
          fields={imageOnly}
          value={{ image }}
          onSave={(v) => merge('home', 'site', { banners: { ...banners, [slot]: v.image } })}
        />
      </AdminBar>
    </section>
  );
}

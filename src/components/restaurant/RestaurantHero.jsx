import Tag from '../shared/Tag';
import { AdminBar, EditButton } from '../admin/AdminControls';
import { titleText } from '../admin/fields';
import { merge } from '../../services/contentActions';

export default function RestaurantHero({ intro }) {
  return (
    <section className="rhero">
      <Tag invert sticker>FOOD</Tag>
      <h1 className="display rhero__title">{intro?.title}</h1>
      <p className="lead">{intro?.text}</p>
      <AdminBar>
        <EditButton title="Editar introducción del resto" label="Texto" fields={titleText} value={intro} onSave={(v) => merge('restaurant', 'intro', v)} />
      </AdminBar>
    </section>
  );
}

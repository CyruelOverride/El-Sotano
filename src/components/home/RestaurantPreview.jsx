import { Link } from 'react-router-dom';
import Photo from '../shared/Photo';
import Tag from '../shared/Tag';
import Reveal from '../shared/Reveal';
import { AdminBar, EditButton } from '../admin/AdminControls';
import { imageOnly, titleText } from '../admin/fields';
import { merge } from '../../services/contentActions';

export default function RestaurantPreview({ restaurant }) {
  if (!restaurant) return null;
  return (
    <section className="rpreview">
      <Photo src={restaurant.image} alt={restaurant.title} label="RESTO" className="rpreview__photo" />
      <Reveal className="rpreview__body">
        <Tag invert sticker>FOOD</Tag>
        <h2 className="display">{restaurant.title}</h2>
        <p className="lead">{restaurant.text}</p>
        <AdminBar>
          <EditButton title="Editar texto del resto" label="Texto" fields={titleText} value={restaurant} onSave={(v) => merge('home', 'restaurant', v)} />
          <EditButton title="Editar imagen del resto" label="Imagen" fields={imageOnly} value={restaurant} onSave={(v) => merge('home', 'restaurant', v)} />
        </AdminBar>
        <Link to="/resto" className="btn">Ver el resto →</Link>
      </Reveal>
    </section>
  );
}

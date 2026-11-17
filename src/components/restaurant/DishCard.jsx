import Photo from '../shared/Photo';
import { AdminBar, DeleteButton, EditButton } from '../admin/AdminControls';
import { dishFields } from '../admin/fields';
import { useContent } from '../../hooks/useContent';
import { removeById, upsertById } from '../../services/contentActions';

export default function DishCard({ dish }) {
  const { data } = useContent('restaurant');
  const hasPrice = dish.price !== null && dish.price !== undefined && dish.price !== '';
  return (
    <article className="dish">
      {dish.image && <Photo src={dish.image} alt={dish.name} ratio="1 / 1" />}
      <div className="dish__body">
        <h4 className="dish__name display-s">{dish.name}</h4>
        {hasPrice && <span className="dish__price mono">{dish.price}</span>}
        {dish.description && <p>{dish.description}</p>}
        <AdminBar>
          <EditButton
            title={`Editar: ${dish.name}`}
            fields={dishFields(data.restaurant?.categories)}
            value={{ type: 'COMIDA', ...dish, price: dish.price ?? '' }}
            onSave={(v) => upsertById('restaurant', 'dishes', { ...v, price: v.price || null, id: dish.id })}
          />
          <DeleteButton
            title={`Eliminar: ${dish.name}`}
            message={`Se quitará "${dish.name}" del menú.`}
            onConfirm={() => removeById('restaurant', 'dishes', dish.id)}
          />
        </AdminBar>
      </div>
    </article>
  );
}

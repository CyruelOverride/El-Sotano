import DishCard from './DishCard';
import Reveal from '../shared/Reveal';
import { useAuth } from '../../hooks/useAuth';
import { useContent } from '../../hooks/useContent';
import { AddButton, AdminBar, DeleteButton, EditButton } from '../admin/AdminControls';
import { categoryFields, dishFields } from '../admin/fields';
import { upsertById } from '../../services/contentActions';
import { mutate, uid } from '../../services/contentService';

export default function MenuCategory({ category, dishes, index }) {
  const { isAdmin } = useAuth();
  const { data } = useContent('restaurant');
  if (!dishes.length && !isAdmin) return null;
  return (
    <Reveal as="section" className="mcat" id={`cat-${category.id}`}>
      <h3 className="mcat__title"><span className="mono">{String(index + 1).padStart(2, '0')}</span><span className="display">{category.name}</span></h3>
      <AdminBar>
        <EditButton
          title={`Editar categoría: ${category.name}`}
          label="Categoría"
          fields={categoryFields}
          value={category}
          onSave={(v) => upsertById('restaurant', 'categories', { id: category.id, name: v.name })}
        />
        <DeleteButton
          title={`Eliminar categoría: ${category.name}`}
          label="Categoría"
          message={`Se eliminará la categoría "${category.name}" y sus ${dishes.length} plato(s). Esta acción no se puede deshacer.`}
          onConfirm={() => mutate('restaurant', (d) => {
            d.categories = d.categories.filter((c) => c.id !== category.id);
            d.dishes = d.dishes.filter((x) => x.categoryId !== category.id);
          })}
        />
        <AddButton
          title={`Nuevo plato en ${category.name}`}
          label="Agregar plato"
          fields={dishFields(data.restaurant?.categories)}
          initial={{ type: 'COMIDA', categoryId: category.id }}
          onSave={(v) => upsertById('restaurant', 'dishes', { ...v, price: v.price || null, id: uid('d') })}
        />
      </AdminBar>
      <div className="mcat__dishes">{dishes.map((d) => <DishCard key={d.id} dish={d} />)}</div>
    </Reveal>
  );
}

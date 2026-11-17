import SectionTitle from '../shared/SectionTitle';
import MenuCategory from './MenuCategory';
import { useAuth } from '../../hooks/useAuth';
import { AddButton, AdminBar } from '../admin/AdminControls';
import { categoryFields } from '../admin/fields';
import { pushItem } from '../../services/contentActions';
import { uid } from '../../services/contentService';

export default function MenuSection({ categories = [], dishes = [] }) {
  const { isAdmin } = useAuth();
  if (!dishes.length && !isAdmin) return null;
  return (
    <section className="section">
      <SectionTitle number={2} label="Carta">Menú</SectionTitle>
      <nav className="menu-nav" aria-label="Categorías del menú">
        {categories.map((c) => <a key={c.id} href={`#cat-${c.id}`} className="chip mono">{c.name}</a>)}
      </nav>
      <AdminBar className="admin-bar--row">
        <AddButton
          title="Nueva categoría"
          label="Agregar categoría"
          fields={categoryFields}
          initial={{ name: '' }}
          onSave={(v) => pushItem('restaurant', 'categories', { id: uid('c'), name: v.name })}
        />
      </AdminBar>
      {categories.map((c, i) => <MenuCategory key={c.id} index={i} category={c} dishes={dishes.filter((d) => d.categoryId === c.id)} />)}
    </section>
  );
}

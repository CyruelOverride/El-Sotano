import SectionTitle from '../shared/SectionTitle';
import ImageGallery from '../shared/ImageGallery';
import { useAuth } from '../../hooks/useAuth';

export default function GalleryPreview({ images }) {
  const { isAdmin } = useAuth();
  if (!images?.length && !isAdmin) return null;
  return (
    <section className="section">
      <SectionTitle number={4} label="Imágenes">Galería</SectionTitle>
      <ImageGallery images={images} admin={{ section: 'gallery', path: 'items' }} />
    </section>
  );
}

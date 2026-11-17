import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Photo from '../shared/Photo';
import Logo from '../layout/Logo';
import { AdminBar, EditButton } from '../admin/AdminControls';
import { imageOnly, tagline } from '../admin/fields';
import { merge } from '../../services/contentActions';

export default function Hero({ hero }) {
  return (
    <section className="hero">
      <Photo src={hero?.image} alt="El Sótano" label="HERO — foto del bar" className="hero__photo" eager />
      <div className="hero__content">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
          <h1 className="hero__logo"><Logo size="xl" /></h1>
          {hero?.tagline && <p className="hero__tagline">{hero.tagline}</p>}
          <AdminBar>
            <EditButton title="Editar eslogan" label="Eslogan" fields={tagline} value={hero} onSave={(v) => merge('home', 'hero', v)} />
            <EditButton title="Editar imagen de portada" label="Imagen de portada" fields={imageOnly} value={hero} onSave={(v) => merge('home', 'hero', v)} />
          </AdminBar>
          <div className="hero__cta">
            <Link to="/eventos" className="btn btn--invert">Eventos →</Link>
            <Link to="/resto" className="btn">Resto →</Link>
          </div>
        </motion.div>
      </div>
      <a href="#contenido" className="hero__scroll mono" aria-label="Bajar al contenido">SCROLL<span /></a>
    </section>
  );
}

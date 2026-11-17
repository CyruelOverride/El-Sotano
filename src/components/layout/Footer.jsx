import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useContent } from '../../hooks/useContent';
import { NAV } from './Navbar';
import { AdminBar } from '../admin/AdminControls';
import SiteEditButton from '../admin/SiteEditButton';

export default function Footer() {
  const { data } = useContent('home');
  const site = data.home?.site;

  return (
    <footer className="footer">
      <div className="footer__big display" aria-hidden="true">El Sótano</div>
      <div className="footer__grid">
        <div>
          <Logo size="lg" />
        </div>
        <div>
          <h3 className="mono">Ubicación</h3>
          <p>{site?.address}</p>
          {site?.email && <p><a href={`mailto:${site.email}`}>{site.email}</a></p>}
          {site?.phone && <p>{site.phone}</p>}
        </div>
        <div>
          <h3 className="mono">Horarios</h3>
          {site?.hours?.map((h, i) => <p key={i}>{h.days}<br /><span className="mono">{h.time}</span></p>)}
        </div>
        <div>
          <h3 className="mono">Redes</h3>
          <ul>{site?.social?.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a></li>)}</ul>
        </div>
        <div>
          <h3 className="mono">Mapa</h3>
          <ul>{NAV.map((n) => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}</ul>
        </div>
      </div>
      <AdminBar className="admin-bar--row"><SiteEditButton site={site} /></AdminBar>
      <p className="footer__legal mono">© {new Date().getFullYear()} El Sótano</p>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';

export const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/resto', label: 'Resto' },
  { to: '/proximamente', label: 'Próximamente' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo" aria-label="ElSotano — inicio"><Logo /></Link>

      <nav className="navbar__links" aria-label="Principal">
        {NAV.map((n, i) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `navblock ${i % 2 === 0 ? 'navblock--w' : 'navblock--b'}${isActive ? ' is-active' : ''}`}>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="navbar__burger mono" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
        {open ? 'CERRAR ✕' : 'MENÚ ＋'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Menú móvil"
            initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}>
            {NAV.map((n, i) => (
              <motion.div key={n.to} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06 }}>
                <NavLink to={n.to} end={n.end} className={({ isActive }) => `mobile-menu__link${isActive ? ' is-active' : ''}`}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>{n.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

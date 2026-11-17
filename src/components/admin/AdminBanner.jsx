import { useAuth } from '../../hooks/useAuth';

// Franja fija visible solo para el admin: indica el modo edición y permite salir.
export default function AdminBanner() {
  const { isAdmin, email, logout } = useAuth();
  if (!isAdmin) return null;
  return (
    <div className="adminbanner mono" role="status">
      <span>MODO ADMIN — {email}</span>
      <button type="button" onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

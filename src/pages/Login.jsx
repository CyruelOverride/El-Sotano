import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePageMeta } from '../hooks/usePageMeta';

// Acceso del administrador. No está en el menú: se entra escribiendo /login.
export default function Login() {
  usePageMeta('Acceso', 'Acceso de administración.');
  const { isAdmin, email: sessionEmail, login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  if (isAdmin) {
    return (
      <section className="page-head login">
        <span className="mono">Administración</span>
        <h1 className="display">Sesión activa</h1>
        <p className="lead">Estás conectado como {sessionEmail}.</p>
        <div className="login__actions">
          <Link to="/" className="btn btn--invert">Ir al sitio</Link>
          <button type="button" className="btn" onClick={logout}>Cerrar sesión</button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-head login">
      <span className="mono">Administración</span>
      <h1 className="display">Acceso</h1>
      <form className="login__form adminform" onSubmit={submit} noValidate={false}>
        <div className="field">
          <label htmlFor="login-email" className="mono">Email</label>
          <input id="login-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="login-pass" className="mono">Contraseña</label>
          <input id="login-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="field__error" role="alert">{error}</p>}
        <button type="submit" className="btn btn--invert" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </section>
  );
}

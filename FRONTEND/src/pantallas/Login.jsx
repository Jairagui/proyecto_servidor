import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// pantalla para iniciar sesion
export default function Login() {
  const { iniciarSesion } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function enviar(e) {
    e.preventDefault();
    setError('');
    try {
      const usuario = await iniciarSesion(email, password);
      // si es admin lo mandamos a su panel, si no al inicio
      navigate(usuario.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login">
      <div className="login-marca">VÉNORA</div>

      <form className="panel" onSubmit={enviar}>
        <h1>Bienvenido</h1>
        <label>Correo</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="mensaje error">{error}</p>}

        <button className="btn ancho">Iniciar sesión</button>
        <p className="nota centrado">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </form>
    </div>
  );
}

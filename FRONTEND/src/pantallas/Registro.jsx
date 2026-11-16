import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// pantalla para crear una cuenta nueva
export default function Registro() {
  const { registrarse } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function enviar(e) {
    e.preventDefault();
    setError('');
    try {
      await registrarse(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login">
      <div className="login-marca">VÉNORA</div>

      <form className="panel" onSubmit={enviar}>
        <h1>Crear cuenta</h1>
        <label>Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Correo</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Contraseña (mínimo 6 caracteres)</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="mensaje error">{error}</p>}

        <button className="btn ancho">Crear cuenta</button>
        <p className="nota centrado">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </form>
    </div>
  );
}

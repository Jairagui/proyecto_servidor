import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// barra de arriba, cambia si hay sesion o no
// el admin no compra, por eso a el no le sale el carrito ni mis pedidos
export default function Navbar() {
  const { usuario, cerrarSesion, carrito, setCarritoAbierto } = useApp();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // numero de piezas que hay en el carrito
  let piezas = 0;
  carrito.forEach((i) => (piezas += i.cantidad));

  return (
    <header className="navbar">
      <Link to="/" className="logo">VÉNORA</Link>

      <nav>
        <NavLink to="/catalogo">Catálogo</NavLink>
      </nav>

      <div className="sesion">
        {!usuario && <Link to="/login">Iniciar sesión</Link>}
        {!usuario && <Link to="/registro" className="btn btn-chico">Crear cuenta</Link>}

        {usuario && usuario.role !== 'admin' && (
          <button className="icono-boton" onClick={() => setCarritoAbierto(true)}>
            🛒
            {piezas > 0 && <span className="contador">{piezas}</span>}
          </button>
        )}

        {usuario && (
          <div className="menu-usuario">
            <button className="icono-boton" onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>

            {menuAbierto && (
              <div className="menu-lista" onClick={() => setMenuAbierto(false)}>
                <p className="menu-nombre">{usuario.name}</p>
                {usuario.role === 'admin' ? (
                  <Link to="/admin">Panel de admin</Link>
                ) : (
                  <Link to="/mis-pedidos">Mis pedidos</Link>
                )}
                <button onClick={cerrarSesion}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

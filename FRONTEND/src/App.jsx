import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import CarritoPanel from './componentes/CarritoPanel';
import Inicio from './pantallas/Inicio';
import Catalogo from './pantallas/Catalogo';
import Producto from './pantallas/Producto';
import Login from './pantallas/Login';
import Registro from './pantallas/Registro';
import MisPedidos from './pantallas/MisPedidos';
import Admin from './pantallas/Admin';
import { useApp } from './context/AppContext';

// si no hay sesion te manda al login, y si la pantalla es de admin revisa el rol
function RutaPrivada({ children, soloAdmin }) {
  const { usuario, cargando } = useApp();

  if (cargando) return <p>Cargando...</p>;
  if (!usuario) return <Navigate to="/login" />;
  if (soloAdmin && usuario.role !== 'admin') return <p className="mensaje error">No tienes permiso para ver esta página</p>;

  return children;
}

// aqui estan todas las pantallas de la pagina
export default function App() {
  return (
    <>
      <Navbar />
      <CarritoPanel />
      <main className="contenedor">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-pedidos" element={<RutaPrivada><MisPedidos /></RutaPrivada>} />
          <Route path="/admin" element={<RutaPrivada soloAdmin><Admin /></RutaPrivada>} />
        </Routes>
      </main>
    </>
  );
}
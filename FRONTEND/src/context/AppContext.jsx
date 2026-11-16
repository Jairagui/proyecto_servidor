import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api';

// aqui guardamos el usuario que inicio sesion y el carrito
// asi cualquier pantalla los puede usar
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // el carrito se guarda en el navegador para que no se borre al recargar
  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('carrito') || '[]'));
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  // al abrir la pagina, si ya habia token pedimos los datos del usuario
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setCargando(false);
      return;
    }
    api.miPerfil()
      .then((u) => setUsuario(u))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setCargando(false));
  }, []);

  // cada que cambia el carrito lo guardamos
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  async function iniciarSesion(email, password) {
    const res = await api.login({ email, password });
    localStorage.setItem('token', res.token);
    setUsuario(res.user);
    return res.user;
  }

  async function registrarse(name, email, password) {
    const res = await api.registrar({ name, email, password });
    localStorage.setItem('token', res.token);
    setUsuario(res.user);
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    setUsuario(null);
  }

  // si el producto ya esta en el carrito solo le sumamos la cantidad
  function agregarAlCarrito(producto, cantidad) {
    const existe = carrito.find((i) => i._id === producto._id);
    if (existe) {
      setCarrito(carrito.map((i) => (i._id === producto._id ? { ...i, cantidad: i.cantidad + cantidad } : i)));
    } else {
      setCarrito([...carrito, { _id: producto._id, name: producto.name, price: producto.price, cantidad: cantidad }]);
    }
  }

  function cambiarCantidad(id, cantidad) {
    if (cantidad < 1) return;
    setCarrito(carrito.map((i) => (i._id === id ? { ...i, cantidad: cantidad } : i)));
  }

  function quitarDelCarrito(id) {
    setCarrito(carrito.filter((i) => i._id !== id));
  }

  return (
    <AppContext.Provider
      value={{
        usuario, cargando, iniciarSesion, registrarse, cerrarSesion,
        carrito, setCarrito, carritoAbierto, setCarritoAbierto,
        agregarAlCarrito, cambiarCantidad, quitarDelCarrito,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

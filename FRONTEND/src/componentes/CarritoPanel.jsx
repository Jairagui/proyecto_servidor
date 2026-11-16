import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPedido, formatoPrecio } from '../api';
import { useApp } from '../context/AppContext';

// panel del carrito que sale del lado derecho
export default function CarritoPanel() {
  const { carrito, setCarrito, carritoAbierto, setCarritoAbierto, cambiarCantidad, quitarDelCarrito } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  if (!carritoAbierto) return null;

  // este subtotal es solo para mostrar, el total real lo saca el backend
  let subtotal = 0;
  carrito.forEach((i) => (subtotal += i.price * i.cantidad));

  async function confirmar() {
    setError('');
    try {
      // al backend solo le mandamos el id y la cantidad de cada producto
      const items = carrito.map((i) => ({ _id: i._id, quantity: i.cantidad }));
      await crearPedido(items);
      setCarrito([]);
      setCarritoAbierto(false);
      navigate('/mis-pedidos');
    } catch (err) {
      // por ejemplo cuando no hay suficiente stock
      setError(err.message);
    }
  }

  return (
    <>
      <div className="fondo-oscuro" onClick={() => setCarritoAbierto(false)} />
      <div className="panel-lateral">
        <div className="titulo-seccion">
          <h2>Tu carrito</h2>
          <button className="icono-boton" onClick={() => setCarritoAbierto(false)}>✕</button>
        </div>

        {carrito.length === 0 && <p className="nota">Tu carrito está vacío</p>}

        {carrito.map((i) => (
          <div key={i._id} className="carrito-item">
            <div>
              <p><strong>{i.name}</strong></p>
              <p className="nota">{formatoPrecio(i.price)}</p>
              <div className="cantidad">
                <button onClick={() => cambiarCantidad(i._id, i.cantidad - 1)}>−</button>
                <span>{i.cantidad}</span>
                <button onClick={() => cambiarCantidad(i._id, i.cantidad + 1)}>+</button>
              </div>
            </div>
            <div className="derecha">
              <strong>{formatoPrecio(i.price * i.cantidad)}</strong>
              <button className="btn-link" onClick={() => quitarDelCarrito(i._id)}>Quitar</button>
            </div>
          </div>
        ))}

        {carrito.length > 0 && (
          <>
            <div className="fila-total">
              <span>Subtotal</span>
              <strong>{formatoPrecio(subtotal)}</strong>
            </div>
            {error && <p className="mensaje error">{error}</p>}
            <button className="btn" onClick={confirmar}>Confirmar pedido</button>
          </>
        )}
      </div>
    </>
  );
}

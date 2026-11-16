import { useEffect, useState } from 'react';
import { misPedidos, formatoPrecio } from '../api';

// pantalla con los pedidos del usuario que inicio sesion
export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    misPedidos()
      .then((data) => setPedidos(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Mis pedidos</h1>
      {error && <p className="mensaje error">{error}</p>}
      {pedidos.length === 0 && <p className="mensaje">Todavía no tienes pedidos.</p>}

      {pedidos.map((p) => (
        <div key={p._id} className="panel pedido">
          <div className="pedido-encabezado">
            <span>Pedido del {new Date(p.createdAt).toLocaleDateString('es-MX')}</span>
            <strong>{formatoPrecio(p.total)}</strong>
          </div>
          <ul>
            {p.items.map((item) => (
              <li key={item._id}>
                {item.quantity} x {item.name} ({formatoPrecio(item.price)} c/u)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

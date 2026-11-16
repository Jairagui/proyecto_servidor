import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { verProducto, formatoPrecio } from '../api';
import { useApp } from '../context/AppContext';

// pantalla con el detalle de un producto
export default function Producto() {
  const { id } = useParams();
  const { usuario, agregarAlCarrito } = useApp();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState('');
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    verProducto(id)
      .then((p) => setProducto(p))
      .catch((err) => setError(err.message));
  }, [id]);

  // solo lo agrega al carrito, el pedido se hace hasta que lo confirmas en el carrito
  function agregar() {
    agregarAlCarrito(producto, Number(cantidad));
    setAgregado(true);
  }

  if (error) return <p className="mensaje error">{error}</p>;
  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="detalle">
      <div className="foto">Imagen</div>

      <div>
        <Link to="/catalogo" className="nota">Volver al catálogo</Link>
        <h1>{producto.name}</h1>
        <p className="nota">{producto.description}</p>
        <p className="precio grande">{formatoPrecio(producto.price)}</p>
        <p>Tallas: <strong>{producto.size.join(', ')}</strong></p>
        <p>{producto.stock > 0 ? producto.stock + ' disponibles' : 'Agotado'}</p>

        {producto.stock > 0 && !usuario && (
          <Link to="/login" className="btn">Inicia sesión para comprar</Link>
        )}

        {producto.stock > 0 && usuario && usuario.role !== 'admin' && (
          <div className="fila">
            <input type="number" min="1" max={producto.stock} value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
            <button className="btn" onClick={agregar}>Agregar al carrito</button>
          </div>
        )}

        {agregado && <p className="mensaje ok">Se agregó al carrito. Para confirmar tu pedido abre el carrito de arriba.</p>}
      </div>
    </div>
  );
}

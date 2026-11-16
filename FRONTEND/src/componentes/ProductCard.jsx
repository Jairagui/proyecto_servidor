import { Link } from 'react-router-dom';
import { formatoPrecio } from '../api';

// tarjeta de un producto, se usa en el inicio y en el catalogo
// todavia no hay fotos, cuando las tengamos van en public/imagenes
export default function ProductCard({ producto }) {
  return (
    <Link to={'/producto/' + producto._id} className="tarjeta">
      <div className="foto">
        Imagen
        {producto.stock === 0 && <span className="etiqueta">Agotado</span>}
      </div>
      <h3>{producto.name}</h3>
      <p className="tallas">{producto.size.join(', ')}</p>
      <p className="precio">{formatoPrecio(producto.price)}</p>
    </Link>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarProductos } from '../api';
import ProductCard from '../componentes/ProductCard';

// pantalla de inicio con el nombre de la tienda y un carrusel de productos
export default function Inicio() {
  const [productos, setProductos] = useState([]);
  const carrusel = useRef(null);

  useEffect(() => {
    listarProductos().then((data) => setProductos(data));
  }, []);

  // mueve el carrusel a la izquierda (-1) o a la derecha (1)
  function mover(lado) {
    carrusel.current.scrollBy({ left: lado * 300, behavior: 'smooth' });
  }

  return (
    <>
      <section className="hero">
        <h1>VÉNORA</h1>
      </section>

      <div className="titulo-seccion">
        <h2>Catálogo</h2>
        <div>
          <button className="icono-boton" onClick={() => mover(-1)}>‹</button>
          <button className="icono-boton" onClick={() => mover(1)}>›</button>
        </div>
      </div>

      <div className="carrusel" ref={carrusel}>
        {productos.map((p) => (
          <ProductCard key={p._id} producto={p} />
        ))}
      </div>

      <p className="centrado">
        <Link to="/catalogo" className="btn">Ver todo el catálogo</Link>
      </p>
    </>
  );
}

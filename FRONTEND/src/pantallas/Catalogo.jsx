import { useEffect, useState } from 'react';
import { listarProductos } from '../api';
import ProductCard from '../componentes/ProductCard';

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'U'];
const filtrosVacios = { search: '', size: '', minPrice: '', maxPrice: '', inStock: '', sort: '' };

// pantalla con todos los productos y el panel de filtros
export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState(filtrosVacios);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [error, setError] = useState('');

  // pide los productos al backend con los filtros que le pasemos
  function buscar(f) {
    setError('');
    listarProductos(f)
      .then((data) => setProductos(data))
      .catch((err) => {
        setError(err.message);
        setProductos([]);
      });
  }

  // al entrar se cargan todos sin filtros
  useEffect(() => {
    buscar(filtrosVacios);
  }, []);

  function cambiar(campo, valor) {
    setFiltros({ ...filtros, [campo]: valor });
  }

  function aplicar(e) {
    e.preventDefault();
    buscar(filtros);
    setPanelAbierto(false);
  }

  function limpiar() {
    setFiltros(filtrosVacios);
    buscar(filtrosVacios);
    setPanelAbierto(false);
  }

  return (
    <>
      <div className="titulo-seccion">
        <h1>Catálogo</h1>
        <button className="btn btn-borde" onClick={() => setPanelAbierto(true)}>☰ Filtros</button>
      </div>

      <p className="nota">{productos.length} prendas</p>
      {error && <p className="mensaje error">{error}</p>}

      <div className="grid">
        {productos.map((p) => (
          <ProductCard key={p._id} producto={p} />
        ))}
      </div>

      {panelAbierto && (
        <>
          <div className="fondo-oscuro" onClick={() => setPanelAbierto(false)} />
          <form className="panel-lateral" onSubmit={aplicar}>
            <div className="titulo-seccion">
              <h2>Filtros</h2>
              <button type="button" className="icono-boton" onClick={() => setPanelAbierto(false)}>✕</button>
            </div>

            <label>Buscar</label>
            <input placeholder="Nombre de la prenda" value={filtros.search} onChange={(e) => cambiar('search', e.target.value)} />

            <label>Talla</label>
            <div className="tallas-botones">
              {TALLAS.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={filtros.size === t ? 'talla activa' : 'talla'}
                  onClick={() => cambiar('size', filtros.size === t ? '' : t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <label>Precio</label>
            <div className="fila">
              <input type="number" placeholder="Mín" value={filtros.minPrice} onChange={(e) => cambiar('minPrice', e.target.value)} />
              <input type="number" placeholder="Máx" value={filtros.maxPrice} onChange={(e) => cambiar('maxPrice', e.target.value)} />
            </div>

            <label>Ordenar</label>
            <select value={filtros.sort} onChange={(e) => cambiar('sort', e.target.value)}>
              <option value="">Sin orden</option>
              <option value="price_asc">Precio de menor a mayor</option>
              <option value="price_desc">Precio de mayor a menor</option>
            </select>

            <label className="check">
              <input
                type="checkbox"
                checked={filtros.inStock === 'true'}
                onChange={(e) => cambiar('inStock', e.target.checked ? 'true' : '')}
              />
              Solo con existencias
            </label>

            <button className="btn">Aplicar filtros</button>
            <button type="button" className="btn-link" onClick={limpiar}>Limpiar filtros</button>
          </form>
        </>
      )}
    </>
  );
}

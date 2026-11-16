import { useEffect, useState } from 'react';
import * as api from '../api';
import { useApp } from '../context/AppContext';

// pantalla del admin con tres pestañas
export default function Admin() {
  const [pestana, setPestana] = useState('productos');

  return (
    <div>
      <h1>Panel de administración</h1>
      <div className="pestanas">
        <button className={pestana === 'productos' ? 'activa' : ''} onClick={() => setPestana('productos')}>Productos</button>
        <button className={pestana === 'usuarios' ? 'activa' : ''} onClick={() => setPestana('usuarios')}>Usuarios</button>
        <button className={pestana === 'pedidos' ? 'activa' : ''} onClick={() => setPestana('pedidos')}>Pedidos</button>
      </div>

      {pestana === 'productos' && <AdminProductos />}
      {pestana === 'usuarios' && <AdminUsuarios />}
      {pestana === 'pedidos' && <AdminPedidos />}
    </div>
  );
}

// pestaña de productos, aqui el admin agrega, edita y borra

const formVacio = { name: '', description: '', price: '', stock: '', size: '' };

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  function cargar() {
    api.listarProductos().then((data) => setProductos(data));
  }

  useEffect(() => {
    cargar();
  }, []);

  function nuevo() {
    setEditandoId(null);
    setForm(formVacio);
    setError('');
    setPanelAbierto(true);
  }

  // abre el panel con los datos del producto para editarlo
  function editar(p) {
    setEditandoId(p._id);
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, size: p.size.join(', ') });
    setError('');
    setPanelAbierto(true);
  }

  async function guardar(e) {
    e.preventDefault();
    setError('');

    const datos = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      // las tallas se escriben separadas por coma y aqui las volvemos un arreglo
      size: form.size.split(',').map((t) => t.trim()),
    };

    try {
      if (editandoId) {
        await api.editarProducto(editandoId, datos);
        setMensaje('Producto actualizado');
      } else {
        await api.crearProducto(datos);
        setMensaje('Producto agregado');
      }
      setPanelAbierto(false);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function borrar(p) {
    if (!confirm('¿Borrar ' + p.name + '?')) return;
    await api.borrarProducto(p._id);
    setMensaje('Producto eliminado');
    cargar();
  }

  return (
    <>
      <div className="titulo-seccion">
        <p className="nota">{productos.length} productos</p>
        <button className="btn" onClick={nuevo}>+ Agregar producto</button>
      </div>

      {mensaje && <p className="mensaje ok">{mensaje}</p>}

      <div className="grid">
        {productos.map((p) => (
          <div key={p._id} className="tarjeta">
            <div className="foto">Imagen</div>
            <h3>{p.name}</h3>
            <p className="tallas">{p.size.join(', ')}</p>
            <p className="precio">{api.formatoPrecio(p.price)}</p>
            <p className="nota">Stock: {p.stock}</p>
            <button className="btn btn-chico btn-borde" onClick={() => editar(p)}>Editar</button>
            <button className="btn-link" onClick={() => borrar(p)}>Borrar</button>
          </div>
        ))}
      </div>

      {panelAbierto && (
        <>
          <div className="fondo-oscuro" onClick={() => setPanelAbierto(false)} />
          <form className="panel-lateral" onSubmit={guardar}>
            <div className="titulo-seccion">
              <h2>{editandoId ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button type="button" className="icono-boton" onClick={() => setPanelAbierto(false)}>✕</button>
            </div>

            <label>Nombre</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label>Descripción</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label>Precio</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <label>Tallas (separadas por coma)</label>
            <input placeholder="S, M, L" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />

            {error && <p className="mensaje error">{error}</p>}

            <button className="btn">{editandoId ? 'Guardar cambios' : 'Agregar'}</button>
          </form>
        </>
      )}
    </>
  );
}

// pestaña de usuarios, aqui el admin cambia el rol

function AdminUsuarios() {
  const { usuario } = useApp();
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  function cargar() {
    api.listarUsuarios().then((data) => setUsuarios(data));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function cambiarRol(u, role) {
    setMensaje('');
    setError('');
    try {
      await api.cambiarRol(u.id, role);
      setMensaje(`${u.name} ahora es ${role}`);
    } catch (err) {
      // por ejemplo si el admin se quiere quitar su propio rol
      setError(err.message);
    }
    cargar();
  }

  return (
    <div className="panel">
      <h2>Usuarios</h2>
      {mensaje && <p className="mensaje ok">{mensaje}</p>}
      {error && <p className="mensaje error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.name} {u.id === usuario.id && '(tú)'}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.role} onChange={(e) => cambiarRol(u, e.target.value)}>
                  <option value="customer">customer</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="nota">El nuevo rol aplica cuando el usuario vuelve a iniciar sesión.</p>
    </div>
  );
}

// pestaña de pedidos, muestra todos los pedidos de la tienda

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    api.todosLosPedidos().then((data) => setPedidos(data));
  }, []);

  return (
    <div>
      {pedidos.length === 0 && <p className="mensaje">Todavía no hay pedidos.</p>}
      {pedidos.map((p) => (
        <div key={p._id} className="panel pedido">
          <div className="pedido-encabezado">
            <span>
              {p.userId ? p.userId.name + ' (' + p.userId.email + ')' : 'Usuario eliminado'} - {new Date(p.createdAt).toLocaleDateString('es-MX')}
            </span>
            <strong>{api.formatoPrecio(p.total)}</strong>
          </div>
          <ul>
            {p.items.map((item) => (
              <li key={item._id}>
                {item.quantity} x {item.name} ({api.formatoPrecio(item.price)} c/u)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

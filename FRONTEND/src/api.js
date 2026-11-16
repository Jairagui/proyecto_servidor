// en este archivo estan todas las llamadas al backend
const API = '/api';

// funcion que usamos para todas las peticiones
// si hay token lo manda, y si el backend regresa error lo lanzamos para mostrarlo
async function peticion(ruta, metodo = 'GET', datos) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers.Authorization = 'Bearer ' + token;

  const res = await fetch(API + ruta, {
    method: metodo,
    headers: headers,
    body: datos ? JSON.stringify(datos) : undefined,
  });
  const respuesta = await res.json();

  if (!res.ok) {
    // si zod manda detalles mostramos el primero
    let mensaje = respuesta.error;
    if (respuesta.details) mensaje = mensaje + ': ' + respuesta.details[0].mensaje;
    throw new Error(mensaje);
  }
  return respuesta;
}

// usuarios
export const registrar = (datos) => peticion('/users', 'POST', datos);
export const login = (datos) => peticion('/users/login', 'POST', datos);
export const miPerfil = () => peticion('/users/me');
export const listarUsuarios = () => peticion('/users');
export const cambiarRol = (id, role) => peticion('/users/' + id + '/role', 'PATCH', { role });

// productos, los filtros que vienen vacios no se mandan
export function listarProductos(filtros = {}) {
  const params = new URLSearchParams();
  for (const campo in filtros) {
    if (filtros[campo]) params.append(campo, filtros[campo]);
  }
  return peticion('/products?' + params.toString());
}
export const verProducto = (id) => peticion('/products/' + id);
export const crearProducto = (datos) => peticion('/products', 'POST', datos);
export const editarProducto = (id, datos) => peticion('/products/' + id, 'PUT', datos);
export const borrarProducto = (id) => peticion('/products/' + id, 'DELETE');

// pedidos
export const crearPedido = (items) => peticion('/orders', 'POST', { items });
export const misPedidos = () => peticion('/orders/my-orders');
export const todosLosPedidos = () => peticion('/orders');

// para mostrar el precio con signo de pesos
export const formatoPrecio = (n) => '$' + n.toLocaleString('es-MX');

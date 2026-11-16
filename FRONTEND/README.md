# VÉNORA — Frontend

Frontend sencillo en **React + Vite** que consume la API del backend.

## Cómo correrlo

Primero el backend tiene que estar corriendo en `http://localhost:3000` (ver el README principal).

```bash
cd FRONTEND
npm install
npm run dev        # http://localhost:5173
```

Vite manda las peticiones de `/api` al backend, así que no hay que configurar nada más.

Usuario admin (lo crea `npm run seed` en el backend): `admin@tienda.com` / `admin123`

## Pantallas

| Ruta | Qué hace | Quién |
|---|---|---|
| `/` | Inicio con carrusel de productos | Todos |
| `/catalogo` | Catálogo con filtros (nombre, talla, precio, existencias, orden) | Todos |
| `/producto/:id` | Detalle de la prenda y agregar al carrito | Todos |
| `/login`, `/registro` | Iniciar sesión y crear cuenta | Todos |
| `/mis-pedidos` | Historial de pedidos | Con sesión |
| `/admin` | Productos, usuarios y pedidos | Solo admin |

## Estructura

```
public/imagenes/  aquí van a ir las fotos de los productos (todavía no hay)
src/
  api.js          todas las llamadas al backend
  context/        sesión y carrito (AppContext)
  componentes/    barra de arriba, tarjeta de producto y panel del carrito
  pantallas/      una por cada pantalla de la página
  index.css       estilos (blanco y negro)
```

El carrito es un panel que se abre con el botón del carrito de arriba cuando ya iniciaste sesión.

Solo hay un `index.html` porque React cambia de pantalla sin recargar la página. Las pantallas están en `src/pantallas` y las rutas en `src/App.jsx`.

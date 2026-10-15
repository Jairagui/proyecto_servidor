# E-commerce Platform — Backend 

API REST de una tienda de ropa en línea hecha con **Node.js + Express 5 + TypeScript**, persistencia en **MongoDB (Mongoose)** y autenticación con **JWT**.

## Features funcionales (Entregable 1)
1. **Autenticación de usuarios** — registro, login y perfil (`/api/users`).
2. **Catálogo de productos** — listar, ver detalle y crear (`/api/products`).
3. **Pedidos** — crear pedido con total calculado en el servidor e historial (`/api/orders`).

## Estructura

```
BACKEND/
  src/
    config/        variables de entorno (validadas con zod) y conexión a MongoDB
    models/        User, Product, Order (Mongoose)
    services/      lógica de negocio
    controllers/   validación de entrada (zod) y respuesta HTTP
    routes/        endpoints y control de acceso por ruta
    middleware/    authenticate (JWT) y manejo de errores
    utils/ types/  utilidades y tipos
  requests.http    peticiones de ejemplo (extensión REST Client de VS Code)
```

Flujo de capas: `Route → Controller → Service → Model → MongoDB`.

## Requisitos
- Node.js 20+
- Docker Desktop (para MongoDB local) o una cuenta de MongoDB Atlas

## Instalación y ejecución

```bash
cd BACKEND
npm install
cp .env.example .env        # completa contraseñas y JWT_SECRET
docker compose up -d        # levanta MongoDB (puerto 27017)
npm run dev                 # http://localhost:3000
```

Comprueba que funciona: `GET http://localhost:3000/api/health` → `{ "status": "ok" }`.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor con recarga automática |
| `npm run build && npm start` | Compila a `dist/` y ejecuta |
| `npm run typecheck` | Verifica tipos |
| `docker compose down` | Detiene MongoDB (los datos se conservan) |

## Endpoints

| Método | Endpoint | Acceso |
|---|---|---|
| GET | `/api/health` | Público |
| POST | `/api/users` | Público |
| POST | `/api/users/login` | Público |
| GET | `/api/users/me` | JWT |
| GET | `/api/products` | Público |
| GET | `/api/products/:id` | Público |
| POST | `/api/products` | JWT |
| POST | `/api/orders` | JWT |
| GET | `/api/orders/my-orders` | JWT |

La documentación completa (request, response y códigos HTTP) está en el PDF del Entregable 1.
Autenticación: header `Authorization: Bearer <token>`.

## Roles
- **customer** (por defecto al registrarse): ver catálogo, comprar, ver sus pedidos, editar/borrar su cuenta.
- **admin** (se crea con `npm run seed`): además gestiona productos y lista usuarios.


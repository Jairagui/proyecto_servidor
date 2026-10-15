# E-commerce Platform

Tienda en línea de ropa. API REST en **Node.js + Express 5 + TypeScript** con persistencia en **MongoDB (Mongoose)**, autenticación **JWT con roles** y pagos con **Stripe**. Incluye un frontend estático (HTML + JS) servido por el mismo servidor.

## Estructura

```
BACKEND/
  src/
    config/        env (validado con zod) y conexión a MongoDB
    models/        User, Product, Order (Mongoose)
    services/      lógica de negocio (auth, productos, pedidos, pagos)
    controllers/   validación de entrada (zod) y respuesta HTTP
    routes/        endpoints y control de acceso por ruta
    middleware/    authenticate / authorize, manejo de errores
    scripts/seed.ts
docs/              arquitectura (diagramas) y API
```

Flujo de capas: `Route → Controller → Service → Model → MongoDB`.

## Requisitos
- Node.js 20+
- Docker Desktop (para MongoDB local) o una cuenta de MongoDB Atlas

## Instalación y ejecución

```bash
cd BACKEND
npm install
cp .env.example .env        # completa contraseñas y JWT_SECRET (ver abajo)
docker compose up -d        # levanta MongoDB en un contenedor (puerto 27017)
npm run seed                # opcional: crea admin y productos de ejemplo
npm run dev                 # http://localhost:3000
```

Variables (`.env.example`): `MONGO_URI`, `JWT_SECRET` (≥16 caracteres), `STRIPE_SECRET_KEY` (opcional; sin ella los pagos responden 503), `ADMIN_EMAIL` / `ADMIN_PASSWORD` (solo para el seed).

### MongoDB con Docker

`BACKEND/docker-compose.yml` levanta `mongo:7` con usuario root, volumen persistente (`mongo_data`) y healthcheck. Lee `MONGO_ROOT_USER`, `MONGO_ROOT_PASSWORD` y `MONGO_DB` de `BACKEND/.env`; `MONGO_URI` debe usar esos mismos valores.

| Comando (dentro de `BACKEND`) | Qué hace |
|---|---|
| `docker compose up -d` | Levanta MongoDB |
| `docker compose ps` | Verifica que esté `healthy` |
| `docker compose logs -f mongo` | Ver logs |
| `docker compose down` | Detiene (los datos se conservan) |
| `docker compose down -v` | Detiene y borra los datos |

### Comandos de la API

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor con recarga automática |
| `npm run build && npm start` | Compila a `dist/` y ejecuta |
| `npm run typecheck` | Verifica tipos |


El frontend se abre en `http://localhost:3000/login.html`.

## Roles
- **customer** (por defecto al registrarse): ver catálogo, comprar, ver sus pedidos, editar/borrar su cuenta.
- **admin** (se crea con `npm run seed`): además gestiona productos y lista usuarios.

La documentación de endpoints está en [`docs/API.md`](docs/API.md) y los diagramas en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

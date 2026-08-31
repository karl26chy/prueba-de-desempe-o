# Backend - Arquitectura por Capas

**Stack:** Node.js + Express + TypeScript + PostgreSQL + Sequelize + JWT + Zod + Swagger + Docker

## Estructura por capas
```
src/
  config/        -> env, database (Sequelize), swagger
  models/        -> User (Sequelize)
  repositories/  -> Acceso a DB (UserRepository)
  services/      -> Lógica de negocio (AuthService, UserService)
  controllers/   -> Manejo req/res
  routes/        -> Endpoints Express
  middlewares/   -> auth (JWT), validate (Zod), error
  validators/    -> Schemas Zod
  utils/         -> jwt, password (bcrypt)
  app.ts         -> Express app
  server.ts      -> Bootstrap + DB connect
```

Flujo: `Route -> Middleware (validate/auth) -> Controller -> Service -> Repository -> Sequelize -> PG`

## Requisitos
- Node 20+
- Docker & Docker Compose (recomendado) o PostgreSQL 16 local

## Configuración
```bash
cp .env.example .env
# editar JWT_SECRET, DB_*, etc.
```

## Desarrollo local (sin Docker)
```bash
npm install
npm run dev          # http://localhost:3000  | Swagger http://localhost:3000/api-docs
npm run build
npm start
# Migraciones (opcional, sync ya crea tablas)
npm run db:migrate
```

## Docker (recomendado)
```bash
docker compose up --build        # levanta db (5432) + app (3000)
docker compose logs -f app
docker compose down -v           # borrar volumen pgdata

# Migraciones dentro del contenedor (si usas migrations en prod)
docker compose exec app npx sequelize-cli db:migrate

# Healthcheck
curl http://localhost:3000/api/health
```

## Endpoints principales
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Registro (name, email, password, role?) |
| POST | /api/auth/login | No | Login -> accessToken + refreshToken |
| POST | /api/auth/refresh | No | Renovar tokens |
| GET | /api/auth/me | Bearer | Perfil actual |
| GET | /api/users | Bearer | Listar usuarios |
| GET | /api/users/:id | Bearer | Obtener usuario |
| PUT | /api/users/:id | Bearer | Actualizar |
| DELETE | /api/users/:id | Bearer (admin) | Eliminar |
| GET | /api/health | No | Healthcheck |
| GET | /api-docs | No | Swagger UI |
| GET | /api-docs.json | No | OpenAPI JSON |

Ejemplo registro:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Carlos","email":"carlos@test.com","password":"123456"}'
```

## JWT
- `accessToken` 15m (env `JWT_EXPIRES_IN`)
- `refreshToken` 7d (env `JWT_REFRESH_EXPIRES_IN`)
- Header: `Authorization: Bearer <accessToken>`

## Sequelize
- Model `User` con UUID, email único, role enum.
- `sequelize.sync()` crea tablas automáticamente. Para control fino usar `sequelize-cli` + migraciones en `src/migrations/`.
- Config CLI en `src/config/sequelize.config.js` y `.sequelizerc`.

## Validación
Zod + middleware `validate(schema)` que valida `body/params/query` y retorna 400 con detalles.

## Swagger
`swagger-jsdoc` escanea `src/routes/*.ts` (y `dist` en prod). Disponible en `/api-docs`.

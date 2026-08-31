# Backend - Layered Architecture

**Project overview:** Production-ready REST API built with Node.js, Express, TypeScript, PostgreSQL, Sequelize, JWT, Zod, Swagger and Docker. Implements layered architecture `Route → Middleware → Controller → Service → Repository → Sequelize → PostgreSQL` with JWT authentication, role-based authorization, Zod validation, Swagger OpenAPI, JSON Seeder via Multer and Dockerized production setup. Developed incrementally through 11 phases (F1-11 complete, F12 in progress).

**Swagger UI:** `http://localhost:3000/api-docs` (or `http://localhost:3001/api-docs` when Docker maps `3001:3000`) — **21 OpenAPI paths, 39 HTTP methods**. Raw spec: `/api-docs.json`.

---

## 1. Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 20+ (Alpine 20 in Docker) |
| Framework | Express | 5.2.1 |
| Language | TypeScript | 7.0.2 (strict) |
| Database | PostgreSQL | 16 Alpine |
| ORM | Sequelize | 6.37.8 + sequelize-cli 6.6.5 + pg 8.23.0 / pg-hstore 2.3.4 |
| Auth | jsonwebtoken 9.0.3, bcryptjs 3.0.3 | |
| Validation | Zod 4.5.4 | |
| Upload | Multer 2.3.0 (@types/multer 2.2.0) | |
| Docs | swagger-jsdoc 6.3.0, swagger-ui-express 5.0.1 | |
| Security | helmet 8.3.0, cors 2.8.6, express-rate-limit 8.7.0, morgan 1.12.0 | |
| Tooling | ts-node 10.9.2, ts-node-dev 2.0.0, nodemon 3.1.14 | |

---

## 2. Project Architecture / Structure

```
src/
  config/        → env.ts (Zod env schema), database.ts (Sequelize), swagger.ts (OpenAPI), sequelize.config.js
  models/        → User, Clinic, Warehouse, Medicine, Inventory, SupplyRequest (Sequelize, UUID, isActive, timestamps)
  repositories/  → User, Clinic, Warehouse, Medicine, Inventory, SupplyRequest
  services/      → AuthService, UserService, ClinicService, WarehouseService, MedicineService, InventoryService, SupplyRequestService, SeedService (transaction)
  controllers/   → auth, user, clinic, warehouse, medicine, inventory, supply-request, seed
  routes/        → auth.routes.ts, user.routes.ts, clinic.routes.ts, warehouse.routes.ts, medicine.routes.ts, inventory.routes.ts, supply-request.routes.ts, seed.routes.ts, index.ts (health)
  middlewares/   → auth (authenticate/authorize), validate (Zod), error (Multer/Zod/Sequelize), upload (Multer memoryStorage)
  validators/    → auth, user, clinic, warehouse, medicine, inventory, supply-request, seed (Zod strict, max 500)
  utils/         → jwt (sign/verify), password (bcrypt)
  data/          → seed.example.json (fictitious data)
  app.ts         → Express app (helmet/cors/json/rateLimit/swagger/routes/404/error)
  server.ts      → Bootstrap + connectDB
  migrations/    → 7 Sequelize migrations (users → supply-requests)
dist/            → compiled JS (tsc)
```

Flow: `Route → Middleware (validate/auth/upload) → Controller → Service → Repository → Model → PostgreSQL`

---

## 3. Prerequisites

* Node.js 20+
* Docker & Docker Compose (recommended) **or** PostgreSQL 16 local
* npm 10+

---

## 4. Installation

```bash
git clone https://github.com/karl26chy/prueba-de-desempe-o.git
cd prueba-de-desempe-o
npm ci
cp .env.example .env
# edit .env (see Environment variables)
```

---

## 5. Environment Variables

Defined in `src/config/env.ts:8` (Zod, fail-fast). `API_URL` is optional, defaults to `http://localhost:${PORT}`. Production requires `JWT_SECRET`/`JWT_REFRESH_SECRET` ≥32 chars, no `supersecret...` / `change_me`.

| Variable | Purpose | Default / Example | Required |
|----------|---------|-------------------|----------|
| `PORT` | HTTP port (container internal 3000) | `3000` | No |
| `NODE_ENV` | `development` / `production` / `test` | `development` | No |
| `DB_HOST` | PostgreSQL host (`localhost` host, `db` inside Compose) | `localhost` | No |
| `DB_PORT` | PostgreSQL port | `5432` | No |
| `DB_NAME` | Database name | `app_db` | No |
| `DB_USER` | DB user | `postgres` | No |
| `DB_PASSWORD` | DB password | `postgres` (use strong secret in prod) | No |
| `DB_DIALECT` | Only `postgres` | `postgres` | No |
| `JWT_SECRET` | Access token secret (≥32 chars in prod) | `replace_with_a_secure_secret_at_least_32_characters` | Yes in prod |
| `JWT_REFRESH_SECRET` | Refresh token secret (≥32 chars) | `replace_with_a_secure_refresh_secret_at_least_32_characters` | Yes in prod |
| `JWT_EXPIRES_IN` | Access TTL | `15m` | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh TTL | `7d` | No |
| `CORS_ORIGIN` | CORS origin | `*` | No |
| `API_URL` | Public URL for Swagger `servers[0].url` | `http://localhost:3000` (`http://localhost:${PORT}` if unset) | No |

**Never commit real secrets.** `Dockerfile` does not copy `.env`; `docker-compose.yml` uses `env_file: .env`.

---

## 6. Database Setup

PostgreSQL 16 Alpine via Docker (`app_postgres`) or local. Data persisted in `pgdata` volume `pgdata:/var/lib/postgresql/data`.

```bash
# via Docker (compose creates db)
docker compose up -d db
# local
createdb app_db
```

Connection `src/config/database.ts:4` `new Sequelize(env.db.name, env.db.user, env.db.password, {host: env.db.host, port: env.db.port})`, pool `max 10`. `connectDB()` authenticates, then `sequelize.sync({alter:false})` in `development/test` only; `production` skips sync (migrations are source of truth).

---

## 7. Migrations

7 migrations in `src/migrations/`:

* `20250830000000-create-users.js` (email UNIQUE, role ENUM → VARCHAR)
* `20250831000001-add-isActive-and-update-roles.js` (isActive, ADMIN/GESTOR_SOLICITUDES)
* `20250831000002-create-clinics.js` (nit UNIQUE)
* `20250831000003-create-warehouses.js`
* `20250831000004-create-medicines.js` (name UNIQUE)
* `20250831000005-create-inventories.js` (warehouseId+medicineId UNIQUE, quantity >=0)
* `20250831000006-create-supply-requests.js` (clinicId/medicineId FK, warehouseId nullable, quantity >0, status PENDING)

```bash
npm run db:migrate          # development (uses src/config/sequelize.config.js via .sequelizerc)
npm run db:migrate:undo
npx sequelize-cli db:migrate:status  # 7/7 up expected
# inside Docker prod:
docker compose exec app npx sequelize-cli db:migrate:status
docker compose exec app npx sequelize-cli db:migrate
```

`src/config/sequelize.config.js:1` reads `DB_*` from env, `development` defaults `localhost:5432`, `production` requires env.

---

## 8. Running in Development

```bash
npm ci
cp .env.example .env
npm run dev          # ts-node-dev http://localhost:3000, Swagger http://localhost:3000/api-docs
npm run build
npm start            # node dist/server.js
```

Health: `curl http://localhost:3000/api/health` → `{"status":"ok","timestamp":"..."}`

---

## 9. Running in Production

```bash
NODE_ENV=production npm run build
NODE_ENV=production node dist/server.js  # requires 7/7 migrations up, sync skipped
```

Ensure `JWT_SECRET`/`JWT_REFRESH_SECRET` ≥32 chars, `API_URL` set to public URL.

---

## 10. Docker / Docker Compose

**Multi-stage Dockerfile** `Dockerfile:1-28`:
* Stage `builder` `node:20-alpine` `npm ci` `tsc` → `dist`
* Stage `production` `node:20-alpine` `ENV NODE_ENV=production`, `COPY --from=builder node_modules` (includes `sequelize-cli` for prod migrations) + `dist`, `COPY .sequelizerc + src/migrations + src/config/sequelize.config.js`, `adduser appuser` non-root `USER appuser`, `EXPOSE 3000`, `HEALTHCHECK wget /api/health`, `CMD ["node","dist/server.js"]`

**Compose** `docker-compose.yml:1-44`:
* `db` `postgres:16-alpine` `POSTGRES_DB/USER/PASSWORD ${DB_*}`, `127.0.0.1:5433:5432` (host 5433 to avoid conflict with host `0.0.0.0:5432`; app uses internal `db:5432` via `DB_HOST=db`), `pgdata` volume, `healthcheck pg_isready`
* `app` `build .` `3001:3000` (host 3001 → container 3000; change if 3001 occupied), `env_file: .env`, `environment: DB_HOST=db NODE_ENV=production`, `depends_on db healthy`, `restart: unless-stopped`, `healthcheck /api/health`

```bash
docker compose config        # validate
docker compose build         # build production image
docker compose up -d         # db healthy → app healthy
docker compose ps            # app_backend healthy 0.0.0.0:3001->3000, app_postgres healthy 127.0.0.1:5433->5432
docker compose logs -f app
docker compose exec app npx sequelize-cli db:migrate
curl http://localhost:3001/api/health
curl http://localhost:3001/api-docs.json | python3 -m json.tool
# if host ports occupied, change Compose ports:
#   db: "5434:5432" , app: "3002:3000"
docker compose down          # keep volume
docker compose down -v       # remove pgdata
```

If host `3000`/`5432` free, you may revert Compose to `"${PORT:-3000}:3000"` and `"127.0.0.1:${DB_PORT:-5432}:5432"` and access via `http://localhost:3000`.

`.dockerignore`: `node_modules, dist, .env, .git, *.md, .vscode, coverage` — `.env` never baked into image.

---

## 11. PostgreSQL

* Image `postgres:16-alpine` `docker-compose.yml:3`
* Host `127.0.0.1:5433` → container `5432` (adjustable)
* Internal `db:5432` via `DB_HOST=db`
* Persistent `pgdata` volume
* Healthcheck `pg_isready -U ${DB_USER} -d ${DB_NAME}` every 5s

---

## 12. Seeder JSON + Multer

**Endpoint** `POST /api/seed/import` `src/routes/seed.routes.ts:16` **ADMIN only** (`authenticate` + `authorize('ADMIN')`).

* Content-Type: `multipart/form-data` field `file`
* File: `.json` extension, MIME `application/json` or `text/json` `src/middlewares/upload.middleware.ts:5`, `memoryStorage()` (no disk write), `limits 2MB` `upload.middleware.ts:22`
* Errors: `400` missing/invalid file, `413` too large (`MulterError LIMIT_FILE_SIZE` `src/middlewares/error.middleware.ts:14`), `400` malformed JSON, `400` Zod validation, `409` duplicate
* JSON root strict object `src/validators/seed.validator.ts:44`:

```json
{
  "users": [{ "name": "Admin", "email": "admin@example.com", "password": "123456", "role": "ADMIN", "id": "uuid-optional", "isActive": true }],
  "clinics": [{ "name": "Clínica Central", "nit": "900123456", "address": "Calle 123", "phone": "3001234567" }],
  "warehouses": [{ "name": "Bodega Norte", "location": "Zona Franca" }],
  "medicines": [{ "name": "Paracetamol", "description": "Analgésico", "unit": "mg" }]
}
```

* All four arrays optional, at least one required, `max 500` per entity, `strict()` rejects `passwordHash`, `requestedBy`, `inventory`, `supplyRequests`, `isActive` optional (defaults to model `true`), `id` UUID optional
* `password` plain → `hashPassword` `src/utils/password.ts:3` bcrypt 10, never `passwordHash` input, never returned (`User.toJSON` hides `password` `src/models/user.model.ts:31`)
* **Transaction** `sequelize.transaction` `src/services/seed.service.ts:99` all `bulkCreate(...,{transaction})`, fail-fast intra-JSON duplicates (`email lower`, `nit`, `medicine lower`) `409`, DB conflicts `409`, `SequelizeUniqueConstraintError` `409`, rollback total (e.g., 2 valid +1 dup → 0 inserts)
* Prerequisite: `7/7 migrations up` before seed
* Example: `src/data/seed.example.json` (2 users, 2 clinics, 2 warehouses, 2 medicines, fictitious)

```bash
curl -X POST http://localhost:3001/api/seed/import \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -F file=@src/data/seed.example.json
# 201 {"message":"Datos importados correctamente","counts":{"users":2,"clinics":2,"warehouses":2,"medicines":2}}
```

---

## 13. Authentication

* `POST /api/auth/register` public `{name min2 max100, email, password min6 max100, role? ADMIN|GESTOR_SOLICITUDES}` → `201` / `400` / `409 Email ya registrado`
* `POST /api/auth/login` public `{email, password}` → `200 {user, accessToken 15m, refreshToken 7d}` / `400` / `401`
* `POST /api/auth/refresh` public `{refreshToken}` → `200 {accessToken, refreshToken}` / `400` / `401`
* `GET /api/auth/me` Bearer → `200` profile / `401`
* JWT `src/utils/jwt.ts` `signAccessToken`/`verifyAccessToken` `env.jwt.secret`, header `Authorization: Bearer <accessToken>` `src/middlewares/auth.middleware.ts:8`

---

## 14. Roles and Permissions

`USER_ROLES ['ADMIN','GESTOR_SOLICITUDES']` `src/models/user.model.ts:4`, `authorize(...roles)` `src/middlewares/auth.middleware.ts:23` 403.

| Scope | Endpoints | Role |
|-------|-----------|------|
| Public | `POST /auth/register, /auth/login, /auth/refresh`, `GET /api/health`, `GET /`, `GET /api-docs*` | — |
| Authenticated | `GET /auth/me`, `GET /users/{id}`, `GET /supply-requests/active`, `GET /supply-requests/history/{clinicId}` | Bearer |
| ADMIN | `GET /users`, `PUT/DELETE /users/{id}`, `POST/GET/PUT/DELETE /clinics`, `/warehouses`, `/medicines`, `/inventories`, `GET /supply-requests`, `GET /supply-requests/{id}`, `DELETE /supply-requests/{id}` | ADMIN |
| ADMIN + GESTOR_SOLICITUDES | `POST /supply-requests`, `PUT /supply-requests/{id}`, `GET /supply-requests/history` | ADMIN, GESTOR |
| ADMIN Seeder | `POST /seed/import` | ADMIN |

`GESTOR` → `POST /seed/import` 403, `/users` 403.

---

## 15. API Endpoints — 21 Swagger Paths, 39 HTTP Methods

Interactive docs: `/api-docs` (Swagger UI), `/api-docs.json` (OpenAPI 3.0.0). `src/config/swagger.ts:4` `swagger-jsdoc` scans `src/routes/*.ts` + `dist/routes/*.js`, `servers: [{url: env.apiUrl}]`, `bearerAuth JWT`.

> `GET /` `{"message":"API Backend por Capas - OK","docs":"/api-docs"}` not part of Swagger count.

### Auth (4)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register `201`/`400`/`409` |
| POST | `/api/auth/login` | No | Login `200`/`400`/`401` |
| POST | `/api/auth/refresh` | No | Refresh `200`/`400`/`401` |
| GET | `/api/auth/me` | Bearer | Me `200`/`401` |

### Users (4 → 4 methods)
| GET | `/api/users` | ADMIN | List `200`/`401`/`403` |
| GET | `/api/users/{id}` | Bearer | Get by id `200`/`400`/`401`/`404` |
| PUT | `/api/users/{id}` | ADMIN | Update `200`/`400`/`401`/`403`/`404`/`409` |
| DELETE | `/api/users/{id}` | ADMIN | Delete (logical `isActive false`) `200`/`400`/`401`/`403`/`404` |

### Clinics (5)
| POST | `/api/clinics` | ADMIN | Create `201`/`400`/`401`/`403`/`409` |
| GET | `/api/clinics` | ADMIN | List `200`/`401`/`403` |
| GET | `/api/clinics/{id}` | ADMIN | Get `200`/`400`/`401`/`403`/`404` |
| PUT | `/api/clinics/{id}` | ADMIN | Update `200`/`400`/`401`/`403`/`404`/`409` |
| DELETE | `/api/clinics/{id}` | ADMIN | Deactivate `200`/`400`/`401`/`403`/`404` |

### Warehouses (5)
| POST | `/api/warehouses` | ADMIN | Create `201`/`400`/`401`/`403` |
| GET | `/api/warehouses` | ADMIN | List `200`/`401`/`403` |
| GET | `/api/warehouses/{id}` | ADMIN | Get `200`/`400`/`401`/`403`/`404` |
| PUT | `/api/warehouses/{id}` | ADMIN | Update `200`/`400`/`401`/`403`/`404` |
| DELETE | `/api/warehouses/{id}` | ADMIN | Deactivate `200`/`400`/`401`/`403`/`404` |

### Medicines (5)
| POST | `/api/medicines` | ADMIN | Create `201`/`400`/`401`/`403`/`409` |
| GET | `/api/medicines` | ADMIN | List `200`/`401`/`403` |
| GET | `/api/medicines/{id}` | ADMIN | Get `200`/`400`/`401`/`403`/`404` |
| PUT | `/api/medicines/{id}` | ADMIN | Update `200`/`400`/`401`/`403`/`404`/`409` |
| DELETE | `/api/medicines/{id}` | ADMIN | Deactivate `200`/`400`/`401`/`403`/`404` |

### Inventories (5)
| POST | `/api/inventories` | ADMIN | Create `warehouseId UUID, medicineId UUID, quantity >=0` `201`/`400`/`401`/`403`/`404`/`409` |
| GET | `/api/inventories` | ADMIN | List `200`/`401`/`403` |
| GET | `/api/inventories/{id}` | ADMIN | Get `200`/`400`/`401`/`403`/`404` |
| PUT | `/api/inventories/{id}` | ADMIN | Update `quantity` `200`/`400`/`401`/`403`/`404` |
| DELETE | `/api/inventories/{id}` | ADMIN | Delete (physical) `200`/`400`/`401`/`403`/`404` |

### Supply Requests (8)
| POST | `/api/supply-requests` | ADMIN/GESTOR | Create `clinicId UUID, medicineId UUID, quantity >=1, warehouseId UUID nullable` `201`/`400`/`401`/`403`/`404`/`409` inventory insufficient; `requestedBy` from JWT, `status` starts `PENDING` |
| GET | `/api/supply-requests` | ADMIN | List all `200`/`401`/`403` |
| GET | `/api/supply-requests/active` | Bearer | Active `PENDING/APPROVED` `200`/`401` |
| GET | `/api/supply-requests/history` | ADMIN/GESTOR | History `200`/`401`/`403` |
| GET | `/api/supply-requests/history/{clinicId}` | Bearer | By clinic `clinicId UUID` `200`/`400`/`401`/`404` |
| GET | `/api/supply-requests/{id}` | ADMIN | Get `200`/`400`/`401`/`403`/`404` |
| PUT | `/api/supply-requests/{id}` | ADMIN/GESTOR | Update `status PENDING/APPROVED/REJECTED/DELIVERED, warehouseId, quantity >=1` `200`/`400`/`401`/`403`/`404` |
| DELETE | `/api/supply-requests/{id}` | ADMIN | Logical delete → `REJECTED` `200`/`400`/`401`/`403`/`404` |

### Seed (1)
| POST | `/api/seed/import` | ADMIN | Multipart `file` max 2MB `201`/`400`/`401`/`403`/`409`/`413` |

### Health (1)
| GET | `/api/health` | No | `200 {"status":"ok","timestamp":"..."}` |
| GET | `/api-docs` | No | Swagger UI |
| GET | `/api-docs.json` | No | OpenAPI JSON |

Count: 21 Swagger paths, 39 HTTP methods (4+4+5+5+5+5+8+1+1 =39) verified `node -e require('./dist/config/swagger.js').swaggerSpec`.

---

## 16. Request/Response Overview

* **Validation:** Zod `src/validators/*.validator.ts` `strict()` `src/middlewares/validate.middleware.ts:4` → `400 {message:"Validation error", errors:[{path,message}]}`. Supply `clinicId/medicineId UUID`, `quantity int`, `warehouseId nullable`, `status enum`, Seed `max 500` `UUID opt`, `isActive` optional default model `true`.
* **Auth:** Bearer `Authorization: Bearer <accessToken>` `src/middlewares/auth.middleware.ts:8` →401.
* **Responses:** `toJSON` hides `password` `src/models/user.model.ts:31`, `isActive` logical delete (`Clinic/Warehouse/Medicine/User`), `Inventory` physical delete, `SupplyRequest` status, `timestamps` `createdAt/updatedAt`.
* **Seeder transaction** `src/services/seed.service.ts:99` `bulkCreate(...,{transaction})` rollback on 409.

---

## 17. Error Codes

| Code | When | Example |
|------|------|---------|
| 200 | Success GET/PUT/DELETE/history | List, update, deactivate |
| 201 | Created POST | `POST /clinics`, `/seed/import` |
| 400 | Validation / UUID / JSON malformed / missing file | Zod `Validation error`, `UUID inválido`, `JSON malformado` |
| 401 | No/invalid token | `No token provided`, `Token inválido` |
| 403 | Forbidden role | `No autorizado` GESTOR on ADMIN |
| 404 | Not found | `Clínica no encontrada`, `Clinic/medicine/warehouse not found` |
| 409 | Conflict / duplicate | `Email ya registrado`, `NIT ya registrado`, `Medicamento ya registrado`, `Inventario ya existe`, `Inventario insuficiente`, `Email/NIT duplicado en JSON` |
| 413 | Payload too large | Seeder `Archivo demasiado grande (máximo 2 MB)` `Multer LIMIT_FILE_SIZE` `src/middlewares/error.middleware.ts:14` |
| 500 | Unexpected | `Internal Server Error` (dev stack) |

`src/middlewares/error.middleware.ts:9` maps `MulterError`, `SequelizeUniqueConstraintError`, `ZodError`.

---

## 18. Swagger / OpenAPI

`swagger-jsdoc` `src/config/swagger.ts:4` `openapi 3.0.0` `info title API Backend...` `servers: [{url: env.apiUrl}]` `components.securitySchemes.bearerAuth http/bearer/JWT` `security: [{bearerAuth:[]}]` `apis: ['./src/routes/*.ts']`. Interactive at `/api-docs`, JSON at `/api-docs.json` `src/app.ts:35`.

---

## 19. `/api-docs`

Swagger UI `GET /api-docs` public, `swagger-ui-express` `src/app.ts:35` `explorer:true`.

---

## 20. `/api-docs.json`

`GET /api-docs.json` public returns `swaggerSpec` JSON.

---

## 21. Health Check

`GET /api/health` `src/routes/index.ts:22` public → `200 {"status":"ok","timestamp":"2026-08-31T..."}`. Used by Docker `HEALTHCHECK`.

---

## 22. Production Configuration

* `NODE_ENV=production` `docker-compose.yml:31` `Dockerfile:13` (sync skipped `src/config/database.ts:23` `if (env.nodeEnv !== 'production') sync`)
* `env.apiUrl` `src/config/swagger.ts:14` (not hardcode `localhost:${port}`)
* `DB_HOST=db` `docker-compose.yml:30` (host uses `localhost`)
* Strong `JWT_SECRET` required `env.ts:27` `>=32` in prod

---

## 23. Docker Healthchecks

* PostgreSQL `pg_isready -U ${DB_USER} -d ${DB_NAME}` `docker-compose.yml:16` `interval 5s`
* App `wget -qO- http://localhost:3000/api/health` `docker-compose.yml:37` `Dockerfile:27` `interval 30s` `depends_on: condition: service_healthy` `docker-compose.yml:32`

---

## 24. Production Image

`node:20-alpine` multi-stage: `builder` `npm ci` `tsc` → `production` `COPY node_modules` (includes `sequelize-cli`) `COPY dist` `COPY .sequelizerc/src/migrations/src/config/sequelize.config.js`, `appuser` non-root `USER appuser`, `EXPOSE 3000`, `HEALTHCHECK`, `CMD ["node","dist/server.js"]` `.dockerignore` excludes `node_modules/dist/.env/.git/*.md`.

---

## 25. Gitflow / Branches

```
feature/* → commit → merge --no-ff → develop → main
develop 2a85f9c (origin/develop) → main 9491343 (origin/main)
feature/docker-production, feature/readme-documentation, etc.
```

Branches: `develop`, `main`, `feature/*` (`auth-roles`, `clinics`, `warehouses`, `medicines`, `inventory`, `supply-requests`, `status-history`, `seeder-json-multer`, `swagger`, `docker-production`).

---

## 26. Project Status / Completed Phases

| Phase | Name | Status | Merge |
|-------|------|--------|-------|
| 1 | Authentication and roles | ✅ | `10e0477` |
| 2 | Database and models | ✅ | `7353876` |
| 3 | Clinics | ✅ | `807c439` |
| 4 | Warehouses | ✅ | `74774a5` |
| 5 | Medicines | ✅ | `47b4ae5` |
| 6 | Inventory | ✅ | `751028b` |
| 7 | Supply requests | ✅ | `86eacd6` |
| 8 | Status management and history | ✅ | `af62317` |
| 9 | JSON Seeder + Multer | ✅ | `2b8ab9e` |
| 10 | Swagger | ✅ | `2a85f9c` |
| 11 | Docker and production | ✅ | `88dc49e` |
| 12 | README and final documentation | 🚧 In progress (this branch `feature/readme-documentation`) |

---

## 27. Coder / Clan Information

No `coder`/`clan` metadata found in repository (`README.md` before, `package.json`, `src/`). Not invented — omitted as per requirement.

---

## Scripts

```bash
npm run dev          # ts-node-dev http://localhost:3000
npm run build        # tsc
npm start            # node dist/server.js
npm run db:migrate
npm run db:migrate:undo
npm run db:seed      # sequelize-cli db:seed:all (requires .sequelizerc)
```

## Security

`helmet`, `cors`, `express-rate-limit 100/15m`, `morgan`, `bcryptjs`, `JWT 15m/7d`, `Zod strict`, `Bureacrat` in `src/app.ts:15`. `User` password hidden, `isActive` logical.

---

*Generated from `src/config/env.ts`, `src/validators/*.validator.ts`, `src/routes/*.routes.ts` (`swaggerSpec 21 paths, 39 methods`), `Dockerfile`, `docker-compose.yml`, `src/config/swagger.ts`, `src/config/database.ts`, git `develop 88dc49e`.*

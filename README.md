# Customer CRM Backend

API de autenticación y gestión de usuarios con arquitectura hexagonal, Node.js, Express y TypeScript.

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el `.env` con tu DATABASE_URL de Neon y JWT_SECRET

4. Ejecuta las migraciones:
   ```bash
   npx prisma migrate dev --name init
   ```

## Desarrollo

Inicia el servidor:
```bash
npm run dev
```

El servidor correrá en `http://localhost:3000`

## Documentación API

Accede a **Swagger UI** en:
```
http://localhost:3000/api/docs
```

## Endpoints

### 🔐 Autenticación (Auth)

**Registro**
```bash
POST /api/auth/register
```

**Login**
```bash
POST /api/auth/login
```

**Perfil (requiere JWT)**
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

### 👥 Clientes (Clients)

| Story | Método | Ruta | Descripción |
|-------|--------|------|-------------|
| US-06 | POST | `/api/clients` | Registrar cliente |
| US-07 | GET | `/api/clients?estado=ACTIVO&empresa=xyz` | Listar con filtros |
| US-08 | GET | `/api/clients/:id` | Ver perfil completo |
| US-09 | PUT | `/api/clients/:id` | Actualizar cliente |
| US-10 | PATCH | `/api/clients/:id/deactivate` | Desactivar (soft delete) |

Ver [`CLIENTS_ENDPOINTS.md`](./CLIENTS_ENDPOINTS.md) para ejemplos detallados.

### 📞 Contactos (Contacts)

| Story | Método | Ruta | Descripción |
|-------|--------|------|-------------|
| US-12 | POST | `/api/contacts` | Registrar contacto |
| US-12 | GET | `/api/contacts/client/:clienteId` | Listar contactos del cliente |

### 💰 Oportunidades (Opportunities)

| Story | Método | Ruta | Descripción |
|-------|--------|------|-------------|
| US-13 | POST | `/api/opportunities` | Crear oportunidad |
| US-14 | PATCH | `/api/opportunities/:id/stage` | Avanzar etapa |
| US-15 | GET | `/api/opportunities/client/:clienteId` | Listar por cliente |

Ver [`CONTACTS_OPPORTUNITIES.md`](./CONTACTS_OPPORTUNITIES.md) para ejemplos detallados.

### 📅 Actividades (Activities)

| Story | Método | Ruta | Descripción |
|-------|--------|------|-------------|
| US-17 | POST | `/api/activities` | Registrar actividad |
| US-17 | GET | `/api/activities?clienteId=` | Listar actividades |

Ver [`ACTIVITIES.md`](./ACTIVITIES.md) para ejemplos detallados.

### 📊 Dashboard y Exportación

| Story | Método | Ruta | Descripción |
|-------|--------|------|-------------|
| US-22 | GET | `/api/dashboard/summary` | KPIs: clientes activos, oportunidades, pipeline |
| US-23 | GET | `/api/clients/export/csv` | Descargar clientes en CSV |

Ver [`DASHBOARD_EXPORT.md`](./DASHBOARD_EXPORT.md) para ejemplos detallados.

## Arquitectura

```
src/
├── domain/              # Entidades y puertos (interfaces)
├── application/         # Casos de uso (lógica de negocio)
├── infrastructure/      # Implementaciones (Prisma, BD)
├── interfaces/          # Controladores, rutas, middlewares
└── config/              # Configuraciones (Swagger)
```

## Tech Stack

- **Node.js** + **Express** - Framework web
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** (Neon) - Base de datos
- **Bcrypt** - Hashing de contraseñas
- **JWT** - Autenticación
- **Swagger** - Documentación API

## Variables de entorno

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
JWT_SECRET="your_secret_key"
PORT=3000
```

## Scripts

- `npm run dev` - Desarrollo con auto-reload
- `npm run build` - Compilar a JavaScript
- `npm start` - Iniciar servidor compilado
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:migrate` - Ejecutar migraciones

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

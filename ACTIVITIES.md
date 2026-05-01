# 📅 Módulo de Actividades - US-17

## 🎯 Registrar actividad de cliente

```bash
POST /api/activities

Body:
{
  "clienteId": "550e8400-e29b-41d4-a716-446655440000",
  "tipo": "LLAMADA",
  "descripcion": "Llamada de seguimiento con el cliente",
  "fecha": "2026-05-15T14:30:00Z"
}

Response 201:
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "clienteId": "550e8400-e29b-41d4-a716-446655440000",
  "tipo": "LLAMADA",
  "descripcion": "Llamada de seguimiento con el cliente",
  "fecha": "2026-05-15T14:30:00Z",
  "createdAt": "2026-05-01T10:30:00Z",
  "updatedAt": "2026-05-01T10:30:00Z"
}
```

### Tipos de Actividad

| Tipo | Descripción |
|------|-------------|
| **LLAMADA** | Llamada telefónica con el cliente |
| **REUNION** | Reunión o videoconferencia |
| **CORREO** | Envío/recepción de correo importante |
| **NOTA** | Nota o anotación general |

### Validaciones:

- ✅ clienteId debe existir
- ✅ tipo debe ser uno de: LLAMADA, REUNION, CORREO, NOTA
- ✅ descripcion no puede estar vacía
- ✅ fecha es requerida (ISO 8601 format)
- ✅ Todos los campos son obligatorios

### Errores:

```bash
# Cliente no encontrado
Response 404:
{
  "message": "Client not found"
}

# Tipo inválido
Response 400:
{
  "message": "Tipo must be one of: LLAMADA, REUNION, CORREO, NOTA"
}

# Descripción vacía
Response 400:
{
  "message": "Descripcion cannot be empty"
}

# Campos faltantes
Response 400:
{
  "message": "clienteId, tipo, descripcion and fecha are required"
}
```

---

## 📋 Listar actividades por cliente

```bash
GET /api/activities?clienteId=550e8400-e29b-41d4-a716-446655440000

Response 200:
[
  {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "clienteId": "550e8400-e29b-41d4-a716-446655440000",
    "tipo": "LLAMADA",
    "descripcion": "Llamada de seguimiento con el cliente",
    "fecha": "2026-05-15T14:30:00Z",
    "createdAt": "2026-05-01T10:30:00Z",
    "updatedAt": "2026-05-01T10:30:00Z"
  },
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "clienteId": "550e8400-e29b-41d4-a716-446655440000",
    "tipo": "REUNION",
    "descripcion": "Presentación de propuesta",
    "fecha": "2026-05-20T10:00:00Z",
    "createdAt": "2026-05-01T11:00:00Z",
    "updatedAt": "2026-05-01T11:00:00Z"
  },
  {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "clienteId": "550e8400-e29b-41d4-a716-446655440000",
    "tipo": "CORREO",
    "descripcion": "Envío de documentación técnica",
    "fecha": "2026-05-10T09:15:00Z",
    "createdAt": "2026-05-01T09:20:00Z",
    "updatedAt": "2026-05-01T09:20:00Z"
  }
]
```

### Query Parameters:

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `clienteId` | UUID | ✅ Sí | ID del cliente |

### Ordenamiento:

- Las actividades se devuelven ordenadas por **fecha descendente** (más recientes primero)

### Errores:

```bash
# clienteId no proporcionado
Response 400:
{
  "message": "clienteId query parameter is required"
}

# Cliente no encontrado
Response 404:
{
  "message": "Client not found"
}
```

---

## 📊 Arquitectura

```
domain/
├── entities/Activity.ts
└── repositories/IActivityRepository.ts

application/use-cases/
├── createActivity.ts
└── getActivitiesByClient.ts

infrastructure/repositories/
└── activityRepository.ts

interfaces/
├── controllers/activityController.ts
└── routes/activityRoutes.ts
```

---

## 🗄️ Base de datos

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  clienteId UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tipo VARCHAR(50),
  descripcion TEXT,
  fecha TIMESTAMP,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

---

## 🧪 Testing en Postman

### 1. Crear cliente (si no existe)
```bash
POST http://localhost:3000/api/clients

{
  "nombre": "Cliente XYZ",
  "email": "xyz@empresa.com",
  "telefono": "+34912345678",
  "empresa": "XYZ Inc"
}
```

### 2. Registrar actividad - Llamada
```bash
POST http://localhost:3000/api/activities

{
  "clienteId": "{CLIENT_ID}",
  "tipo": "LLAMADA",
  "descripcion": "Llamada de seguimiento",
  "fecha": "2026-05-15T14:30:00Z"
}
```

### 3. Registrar actividad - Reunión
```bash
POST http://localhost:3000/api/activities

{
  "clienteId": "{CLIENT_ID}",
  "tipo": "REUNION",
  "descripcion": "Presentación de solución",
  "fecha": "2026-05-20T10:00:00Z"
}
```

### 4. Registrar actividad - Correo
```bash
POST http://localhost:3000/api/activities

{
  "clienteId": "{CLIENT_ID}",
  "tipo": "CORREO",
  "descripcion": "Envío de propuesta económica",
  "fecha": "2026-05-18T09:30:00Z"
}
```

### 5. Registrar actividad - Nota
```bash
POST http://localhost:3000/api/activities

{
  "clienteId": "{CLIENT_ID}",
  "tipo": "NOTA",
  "descripcion": "Cliente interesado en módulo de finanzas",
  "fecha": "2026-05-22T16:00:00Z"
}
```

### 6. Listar todas las actividades
```bash
GET http://localhost:3000/api/activities?clienteId={CLIENT_ID}
```

---

## 📈 Casos de Uso

### 1. Seguimiento de cliente
```bash
POST /api/activities
{
  "clienteId": "550e8400...",
  "tipo": "LLAMADA",
  "descripcion": "Seguimiento post-venta. Cliente satisfecho con implementación",
  "fecha": "2026-05-25T15:00:00Z"
}
```

### 2. Historial de interacciones
```bash
GET /api/activities?clienteId=550e8400...
```
Devuelve todas las interacciones con el cliente en orden cronológico inverso.

### 3. Registro de reuniones
```bash
POST /api/activities
{
  "clienteId": "550e8400...",
  "tipo": "REUNION",
  "descripcion": "Reunión con equipo técnico. Discutidos requerimientos funcionales y timeline",
  "fecha": "2026-05-28T10:30:00Z"
}
```

### 4. Comunicaciones
```bash
POST /api/activities
{
  "clienteId": "550e8400...",
  "tipo": "CORREO",
  "descripcion": "Sent invoice #INV-2026-001 for $50,000",
  "fecha": "2026-05-27T14:00:00Z"
}
```

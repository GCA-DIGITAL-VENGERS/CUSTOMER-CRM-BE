# 🧩 Módulo de Clientes - Historias de Usuario

## US-06: Registrar cliente
```bash
POST /api/clients

Body:
{
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "telefono": "+34912345678",
  "empresa": "Tech Solutions"
}

Response 201:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "telefono": "+34912345678",
  "empresa": "Tech Solutions",
  "estado": "ACTIVO",
  "createdAt": "2026-05-01T10:30:00Z",
  "updatedAt": "2026-05-01T10:30:00Z"
}
```

## US-07: Listar clientes con filtros
```bash
GET /api/clients?estado=ACTIVO&empresa=Tech

Response 200:
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Juan Pérez",
    "email": "juan@empresa.com",
    "telefono": "+34912345678",
    "empresa": "Tech Solutions",
    "estado": "ACTIVO",
    "createdAt": "2026-05-01T10:30:00Z",
    "updatedAt": "2026-05-01T10:30:00Z"
  }
]

Parámetros opcionales:
- estado: ACTIVO | INACTIVO
- empresa: nombre o parte del nombre (case-insensitive)
```

## US-08: Ver perfil completo de cliente
```bash
GET /api/clients/550e8400-e29b-41d4-a716-446655440000

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "telefono": "+34912345678",
  "empresa": "Tech Solutions",
  "estado": "ACTIVO",
  "createdAt": "2026-05-01T10:30:00Z",
  "updatedAt": "2026-05-01T10:30:00Z"
}
```

## US-09: Actualizar cliente
```bash
PUT /api/clients/550e8400-e29b-41d4-a716-446655440000

Body (todos los campos opcionales):
{
  "nombre": "Juan Carlos Pérez",
  "telefono": "+34987654321",
  "empresa": "Solutions Tech"
}

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Carlos Pérez",
  "email": "juan@empresa.com",
  "telefono": "+34987654321",
  "empresa": "Solutions Tech",
  "estado": "ACTIVO",
  "createdAt": "2026-05-01T10:30:00Z",
  "updatedAt": "2026-05-01T11:45:00Z"
}
```

## US-10: Desactivar cliente (Soft Delete)
```bash
PATCH /api/clients/550e8400-e29b-41d4-a716-446655440000/deactivate

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "telefono": "+34912345678",
  "empresa": "Tech Solutions",
  "estado": "INACTIVO",
  "createdAt": "2026-05-01T10:30:00Z",
  "updatedAt": "2026-05-01T12:00:00Z"
}

Nota: El cliente no se elimina de la BD, solo cambia de estado a INACTIVO
```

---

## Validaciones y Errores

### Email duplicado (US-06, US-09)
```bash
Response 400:
{
  "message": "Email already registered"
}
```

### Cliente no encontrado (US-08, US-09, US-10)
```bash
Response 404:
{
  "message": "Client not found"
}
```

### Cliente ya inactivo (US-10)
```bash
Response 400:
{
  "message": "Client is already inactive"
}
```

### Campos requeridos (US-06)
```bash
Response 400:
{
  "message": "nombre, email, telefono and empresa are required"
}
```

---

## Arquitectura Implementada

```
domain/
├── entities/Client.ts                    # Entidad de cliente
└── repositories/IClientRepository.ts     # Contrato del repositorio

application/
└── use-cases/
    ├── createClient.ts                   # US-06
    ├── listClients.ts                    # US-07
    ├── getClient.ts                      # US-08
    ├── updateClient.ts                   # US-09
    └── deactivateClient.ts               # US-10

infrastructure/
└── repositories/clientRepository.ts      # Implementación Prisma

interfaces/
├── controllers/clientController.ts       # Lógica HTTP
└── routes/clientRoutes.ts               # Definición de rutas
```

---

## Testing en Postman

1. **Registrar cliente:**
   ```
   POST http://localhost:3000/api/clients
   Content-Type: application/json
   
   {
     "nombre": "Ana García",
     "email": "ana@empresa.com",
     "telefono": "+34912345678",
     "empresa": "Digital Inc"
   }
   ```

2. **Listar todos:**
   ```
   GET http://localhost:3000/api/clients
   ```

3. **Listar filtrados:**
   ```
   GET http://localhost:3000/api/clients?estado=ACTIVO&empresa=Digital
   ```

4. **Ver detalle:**
   ```
   GET http://localhost:3000/api/clients/{id}
   ```

5. **Actualizar:**
   ```
   PUT http://localhost:3000/api/clients/{id}
   Content-Type: application/json
   
   {
     "nombre": "Ana María García"
   }
   ```

6. **Desactivar:**
   ```
   PATCH http://localhost:3000/api/clients/{id}/deactivate
   ```

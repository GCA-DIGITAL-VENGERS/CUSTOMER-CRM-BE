# 📞 Módulo de Contactos y Oportunidades

## 🧩 US-12: Registrar contactos vinculados a un cliente

```bash
POST /api/contacts

Body:
{
  "clienteId": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "María García",
  "cargo": "Gerente de Ventas",
  "email": "maria@empresa.com"
}

Response 201:
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "clienteId": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "María García",
  "cargo": "Gerente de Ventas",
  "email": "maria@empresa.com",
  "createdAt": "2026-05-01T10:30:00Z",
  "updatedAt": "2026-05-01T10:30:00Z"
}
```

### Validaciones:
- ✅ clienteId debe existir
- ✅ Email único por cliente (no se puede registrar 2 contactos con el mismo email para un cliente)
- ✅ Todos los campos requeridos

---

## 📋 Obtener contactos de un cliente

```bash
GET /api/contacts/client/550e8400-e29b-41d4-a716-446655440000

Response 200:
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "clienteId": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "María García",
    "cargo": "Gerente de Ventas",
    "email": "maria@empresa.com",
    "createdAt": "2026-05-01T10:30:00Z",
    "updatedAt": "2026-05-01T10:30:00Z"
  }
]
```

---

## 💰 US-13: Crear oportunidades de negocio

```bash
POST /api/opportunities

Body:
{
  "clienteId": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Implementación sistema ERP",
  "valor": 50000,
  "fechaCierre": "2026-12-31T23:59:59Z"
}

Response 201:
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "clienteId": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Implementación sistema ERP",
  "valor": 50000,
  "etapa": "PROSPECCION",
  "fechaCierre": "2026-12-31T23:59:59Z",
  "createdAt": "2026-05-01T10:30:00Z",
  "updatedAt": "2026-05-01T10:30:00Z"
}
```

### Validaciones:
- ✅ clienteId debe existir
- ✅ valor > 0
- ✅ fechaCierre debe ser una fecha futura
- ✅ etapa inicial: PROSPECCION

---

## 🚀 US-14: Avanzar etapa de oportunidad

```bash
PATCH /api/opportunities/770e8400-e29b-41d4-a716-446655440002/stage

Body:
{
  "etapa": "PROPUESTA"
}

Response 200:
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "clienteId": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Implementación sistema ERP",
  "valor": 50000,
  "etapa": "PROPUESTA",
  "fechaCierre": "2026-12-31T23:59:59Z",
  "createdAt": "2026-05-01T10:30:00Z",
  "updatedAt": "2026-05-01T10:35:00Z"
}
```

### Flujo de etapas:
```
PROSPECCION → PROPUESTA → NEGOCIACION → CERRADA
```

### Validaciones:
- ✅ Solo se puede avanzar etapas (no ir atrás)
- ✅ etapa debe ser una de: PROSPECCION, PROPUESTA, NEGOCIACION, CERRADA
- ✅ No se puede cambiar etapa de oportunidad CERRADA
- ✅ Oportunidad debe existir

---

## 📊 US-15: Listar oportunidades por cliente

```bash
GET /api/opportunities/client/550e8400-e29b-41d4-a716-446655440000

Response 200:
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "clienteId": "550e8400-e29b-41d4-a716-446655440000",
    "titulo": "Implementación sistema ERP",
    "valor": 50000,
    "etapa": "PROPUESTA",
    "fechaCierre": "2026-12-31T23:59:59Z",
    "createdAt": "2026-05-01T10:30:00Z",
    "updatedAt": "2026-05-01T10:35:00Z"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "clienteId": "550e8400-e29b-41d4-a716-446655440000",
    "titulo": "Soporte técnico 12 meses",
    "valor": 12000,
    "etapa": "NEGOCIACION",
    "fechaCierre": "2026-06-30T23:59:59Z",
    "createdAt": "2026-05-01T11:00:00Z",
    "updatedAt": "2026-05-01T11:45:00Z"
  }
]
```

---

## ❌ Errores

### Email duplicado en contacto (US-12)
```bash
Response 400:
{
  "message": "Contact with this email already exists for this client"
}
```

### Cliente no encontrado (US-12, US-13, US-15)
```bash
Response 404:
{
  "message": "Client not found"
}
```

### Valor inválido (US-13)
```bash
Response 400:
{
  "message": "Valor must be greater than 0"
}
```

### Fecha cierre en el pasado (US-13)
```bash
Response 400:
{
  "message": "Fecha cierre must be in the future"
}
```

### Etapa inválida (US-14)
```bash
Response 400:
{
  "message": "Etapa must be one of: PROSPECCION, PROPUESTA, NEGOCIACION, CERRADA"
}
```

### No puede ir atrás en etapas (US-14)
```bash
Response 400:
{
  "message": "Cannot go back to previous stages"
}
```

### Oportunidad ya cerrada (US-14)
```bash
Response 400:
{
  "message": "Cannot change stage of a closed opportunity"
}
```

---

## 🏗️ Arquitectura

```
domain/
├── entities/
│   ├── Contact.ts
│   └── Opportunity.ts
└── repositories/
    ├── IContactRepository.ts
    └── IOpportunityRepository.ts

application/use-cases/
├── createContact.ts
├── getContactsByClient.ts
├── createOpportunity.ts
├── updateOpportunityStage.ts
└── getOpportunitiesByClient.ts

infrastructure/repositories/
├── contactRepository.ts
└── opportunityRepository.ts

interfaces/
├── controllers/
│   ├── contactController.ts
│   └── opportunityController.ts
└── routes/
    ├── contactRoutes.ts
    └── opportunityRoutes.ts
```

---

## 🗄️ Base de datos (Relaciones)

```sql
Client (1) ──→ (N) Contacts
Client (1) ──→ (N) Opportunities
```

- Cuando se elimina un Cliente, se eliminen en cascada sus Contactos y Oportunidades
- Email único por cliente (composited unique constraint)

---

## 🧪 Testing en Postman

### 1. Crear cliente
```bash
POST http://localhost:3000/api/clients
{
  "nombre": "TechCorp",
  "email": "contact@techcorp.com",
  "telefono": "+34912345678",
  "empresa": "TechCorp Inc"
}
```

### 2. Registrar contacto
```bash
POST http://localhost:3000/api/contacts
{
  "clienteId": "{CLIENT_ID}",
  "nombre": "Juan Director",
  "cargo": "Director Ejecutivo",
  "email": "juan@techcorp.com"
}
```

### 3. Crear oportunidad
```bash
POST http://localhost:3000/api/opportunities
{
  "clienteId": "{CLIENT_ID}",
  "titulo": "Licencias software",
  "valor": 25000,
  "fechaCierre": "2026-12-31T23:59:59Z"
}
```

### 4. Avanzar etapa
```bash
PATCH http://localhost:3000/api/opportunities/{OPP_ID}/stage
{
  "etapa": "PROPUESTA"
}
```

### 5. Listar contactos
```bash
GET http://localhost:3000/api/contacts/client/{CLIENT_ID}
```

### 6. Listar oportunidades
```bash
GET http://localhost:3000/api/opportunities/client/{CLIENT_ID}
```

# 📊 Dashboard y Exportación - US-22, US-23

## 🎯 US-22: Resumen con KPIs para decisiones comerciales

Endpoint que proporciona métricas clave para que los gerentes tomen decisiones con base en datos.

### Endpoint

```bash
GET /api/dashboard/summary

Response 200:
{
  "totalActiveClients": 45,
  "openOpportunities": 23,
  "totalPipelineValue": 1250000,
  "averageDealSize": 54347.83,
  "opportunitiesByStage": {
    "PROSPECCION": 8,
    "PROPUESTA": 7,
    "NEGOCIACION": 5,
    "CERRADA": 12
  }
}
```

### KPIs Incluidos

| Métrica | Descripción | Ejemplo |
|---------|-------------|---------|
| **totalActiveClients** | Cantidad de clientes con estado ACTIVO | 45 |
| **openOpportunities** | Cantidad de oportunidades que NO están CERRADAS | 23 |
| **totalPipelineValue** | Suma de valores de todas las oportunidades abiertas | $1.250.000 |
| **averageDealSize** | Valor promedio por oportunidad abierta | $54.347,83 |
| **opportunitiesByStage** | Desglose de oportunidades por etapa | Ver tabla |

### Desglose por Etapa

```json
{
  "PROSPECCION": 8,    // Explorando nuevas oportunidades
  "PROPUESTA": 7,      // Propuestas en revisión
  "NEGOCIACION": 5,    // En negociación activa
  "CERRADA": 12        // Cerradas (ganadas)
}
```

### Casos de Uso Gerenciales

#### 1. Análisis de Pipeline
```
Total Pipeline: $1.250.000
Promedio por Deal: $54.347,83
Leads por Cerrar: 23
```
→ **Decisión:** Necesito 4-5 más deals en PROSPECCION para alcanzar $1.5M

#### 2. Seguimiento de Etapas
```
PROSPECCION: 8 → PROPUESTA: 7 (-1 en calificación)
PROPUESTA: 7 → NEGOCIACION: 5 (-2 perdidas)
NEGOCIACION: 5 → CERRADA: 12 (+7 ganadas este mes)
```
→ **Decisión:** Focus en propuestas, tasa de cierre es buena (35%)

#### 3. Salud de Cartera
```
Clientes Activos: 45
Oportunidades Abiertas: 23
Ratio: 51% de clientes con oportunidades activas
```
→ **Decisión:** Hay potencial en 22 clientes sin oportunidades

### Endpoint en Postman

```bash
GET http://localhost:3000/api/dashboard/summary

Sin parámetros, sin autenticación requerida.
```

---

## 📥 US-23: Exportar clientes en CSV

Descarga lista de clientes en formato CSV para compartir con el equipo fuera del sistema.

### Endpoint

```bash
GET /api/clients/export/csv

Response 200 (descarga archivo):
Archivo: clientes_2026-05-01.csv

Contenido:
ID,Nombre,Email,Telefono,Empresa,Estado,Fecha de Creación,Fecha de Actualización
550e8400-e29b-41d4-a716-446655440000,Juan Pérez,juan@empresa.com,+34912345678,Tech Solutions,ACTIVO,2026-05-01,2026-05-01
660e8400-e29b-41d4-a716-446655440001,María García,maria@empresa.com,+34987654321,Digital Inc,ACTIVO,2026-05-02,2026-05-02
770e8400-e29b-41d4-a716-446655440002,Carlos López,carlos@empresa.com,+34656565656,Soluciones Web,INACTIVO,2026-04-15,2026-05-01
```

### Características

- ✅ **Descarga automática:** Navegador descarga archivo con nombre: `clientes_YYYY-MM-DD.csv`
- ✅ **Codificación UTF-8:** Soporta caracteres especiales (ñ, á, é, etc.)
- ✅ **Headers incluidos:** Primera fila con nombres de columnas
- ✅ **Todos los clientes:** Activos e inactivos
- ✅ **Formato estándar:** Compatible con Excel, Google Sheets, etc.

### Columnas del CSV

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| ID | UUID del cliente | 550e8400-e29b-41d4-a716-446655440000 |
| Nombre | Nombre completo | Juan Pérez |
| Email | Correo electrónico | juan@empresa.com |
| Telefono | Número de contacto | +34912345678 |
| Empresa | Empresa del cliente | Tech Solutions |
| Estado | ACTIVO o INACTIVO | ACTIVO |
| Fecha de Creación | Cuando se registró | 2026-05-01 |
| Fecha de Actualización | Última modificación | 2026-05-01 |

### Uso en Excel

1. **Descargar CSV:**
   ```
   GET http://localhost:3000/api/clients/export/csv
   ```

2. **Abrir en Excel:**
   - Archivo → Abrir
   - Seleccionar `clientes_2026-05-01.csv`
   - Excel detecta automáticamente las columnas

3. **Filtrar/Ordenar:**
   - Datos → AutoFiltro
   - Filtrar por Estado = ACTIVO
   - Ordenar por Empresa

### Uso Programático

```bash
# Descargar con curl
curl -o clientes.csv http://localhost:3000/api/clients/export/csv

# Con wget
wget http://localhost:3000/api/clients/export/csv -O clientes.csv

# Con Python
import requests
response = requests.get('http://localhost:3000/api/clients/export/csv')
with open('clientes.csv', 'w') as f:
    f.write(response.text)
```

### Endpoint en Postman

```bash
GET http://localhost:3000/api/clients/export/csv

Header: Accept: text/csv

Response: 
- Content-Type: text/csv; charset=utf-8
- Content-Disposition: attachment; filename="clientes_2026-05-01.csv"
```

---

## 📊 Casos de Uso Combinados

### Flujo 1: Análisis Semanal
```bash
1. GET /api/dashboard/summary
   ↓ Analizar KPIs
   ↓ Identificar clientes con bajo engagement
   
2. GET /api/clients/export/csv
   ↓ Descargar lista
   ↓ Enviare-mail al equipo comercial
   ↓ Asignar follow-up por cliente
```

### Flujo 2: Reporte Mensual
```bash
1. GET /api/dashboard/summary
   ↓ Captura: totalPipelineValue, opportunitiesByStage
   ↓ Genera gráficas en PowerPoint
   
2. GET /api/clients/export/csv
   ↓ Importa en Google Sheets
   ↓ Crea tabla dinámica por Empresa
   ↓ Adjunta a reporte de gerencia
```

### Flujo 3: Prospección
```bash
1. GET /api/dashboard/summary
   ↓ Identifica clientes sin oportunidades (45 - 23/2 ≈ 35)
   
2. GET /api/clients/export/csv
   ↓ Filtra Estado = ACTIVO
   ↓ Excluye clientes en negociación
   ↓ Prepara lista para cold call
```

---

## 🏗️ Arquitectura

```
application/use-cases/
├── getDashboardSummary.ts      (calcula KPIs)
└── exportClientsToCSV.ts       (genera CSV)

interfaces/
├── controllers/dashboardController.ts
└── routes/dashboardRoutes.ts
```

### Lógica de Cálculo

```typescript
// totalActiveClients
Clientes con estado = "ACTIVO"

// openOpportunities
Oportunidades con etapa != "CERRADA"

// totalPipelineValue
SUM(oportunidades abiertas.valor)

// averageDealSize
totalPipelineValue / openOpportunities.length

// opportunitiesByStage
COUNT por cada etapa (TODAS las oportunidades)
```

---

## 📈 Ejemplo Real

### Escenario
- 50 clientes totales
- 45 clientes activos
- 32 oportunidades totales (9 cerradas)
- 23 oportunidades abiertas

### KPIs Calculados
```json
{
  "totalActiveClients": 45,
  "openOpportunities": 23,
  "totalPipelineValue": 2150000,
  "averageDealSize": 93478.26,
  "opportunitiesByStage": {
    "PROSPECCION": 10,
    "PROPUESTA": 8,
    "NEGOCIACION": 5,
    "CERRADA": 9
  }
}
```

### Análisis Gerencial
- ✅ Pipeline saludable: $2.15M en oportunidades abiertas
- ✅ Tasa de cierre: 9/32 = 28% (razonable)
- ✅ Cuello de botella: pocas en NEGOCIACION (5)
- ⚠️ Action Item: Acelerar propuestas a negociación

---

## 🧪 Testing en Postman

### Test 1: Dashboard Summary
```bash
GET http://localhost:3000/api/dashboard/summary

Expected:
- Status: 200
- Body: JSON con KPIs
- time: < 500ms
```

### Test 2: Export CSV
```bash
GET http://localhost:3000/api/clients/export/csv

Expected:
- Status: 200
- Content-Type: text/csv
- Content-Disposition: attachment
- Descarga archivo: clientes_2026-05-01.csv
```

### Test 3: CSV Integridad
```bash
1. Descargar CSV
2. Abrir en Excel
3. Verificar:
   - Encabezados presentes
   - Datos con formato correcto
   - Sin caracteres rotos (ñ, á, é)
   - Codificación UTF-8 válida
```

---

## 📋 Endpoints Totales (Ahora 17)

```
DASHBOARD (2) NEW
├── GET   /api/dashboard/summary       (KPIs)
└── GET   /api/clients/export/csv      (Descarga CSV)
```

Total: **17 endpoints funcionales** en el sistema.

# 🚀 Cómo Usar el Asistente RAG en Swagger UI

## Paso 1: Inicia el Servidor

```bash
npm run dev
```

Verás en la terminal:
```
Server running on port 7000
Swagger docs: http://localhost:7000/api/docs
```

## Paso 2: Abre Swagger UI

En el navegador, ve a:
```
http://localhost:7000/api/docs
```

## Paso 3: Encuentra la Sección "AI & RAG"

Desplázate hacia abajo en Swagger UI y busca la sección **"AI & RAG"**.

Verás tres endpoints:

```
POST /api/ai/ask       ← ⭐ USO RECOMENDADO EN SWAGGER
POST /api/ai/chat      ← Para streaming real-time (no ideal en Swagger)
GET  /api/ai/health    ← Verificar que funcione
```

## Paso 4: Haz una Pregunta

### 🟢 **Recomendado: POST /api/ai/ask** (Respuesta JSON completa)

1. Haz click en **"POST /api/ai/ask"**
2. Haz click en **"Try it out"**
3. En el campo `message`, escribe tu pregunta:

```
¿Cuáles son los endpoints disponibles para gestionar clientes?
```

4. Haz click en **"Execute"**

**Resultado:**
```json
{
  "success": true,
  "message": "¿Cuáles son los endpoints disponibles para gestionar clientes?",
  "response": "El sistema CRM proporciona los siguientes endpoints para gestionar clientes: POST /api/clients para crear un nuevo cliente, GET /api/clients para listar todos los clientes...",
  "metadata": {
    "chunksRetrieved": 3,
    "intent": "data-query"
  }
}
```

## Preguntas de Ejemplo

Copia y pega estas preguntas en Swagger:

### Preguntas sobre Endpoints
```
¿Cuáles son los endpoints disponibles para gestionar clientes?
```

```
¿Cómo crear un nuevo cliente?
```

```
¿Qué endpoints tengo para actividades?
```

### Preguntas sobre Procesos
```
¿Cuáles son los pasos para crear una oportunidad de venta?
```

```
¿Cómo actualizar la etapa de una oportunidad?
```

```
¿Qué información se puede registrar en una actividad?
```

### Preguntas sobre Métricas
```
¿Qué métricas proporciona el dashboard?
```

```
¿Cuáles son los KPIs del sistema?
```

### Preguntas Generales
```
¿Qué es una oportunidad en este CRM?
```

```
¿Cuál es la diferencia entre contactos y clientes?
```

## Entendiendo la Respuesta

Cada respuesta tiene tres partes:

### 1. **success**
- `true` si la pregunta se procesó correctamente
- `false` si hubo un error

### 2. **response**
- La respuesta del asistente basada en la documentación del sistema
- Siempre basada ÚNICAMENTE en readmeAgents.md

### 3. **metadata**
- `chunksRetrieved`: Cuántos fragmentos de contexto se usaron (usualmente 1-3)
- `intent`: El tipo de pregunta detectada:
  - `how-to` = Preguntas sobre procesos
  - `data-query` = Preguntas sobre datos/endpoints
  - `general` = Preguntas generales

## Diferencia entre /ask y /chat

| Endpoint | Formato | Mejor para | En Swagger |
|----------|---------|-----------|-----------|
| **POST /api/ai/ask** | JSON completo | Testing, aplicaciones | ✅ Perfecto |
| **POST /api/ai/chat** | Streaming SSE | Tiempo real, chat | ❌ No ideal |

**En Swagger UI, siempre usa `/api/ai/ask`** porque retorna JSON tradicional.

## Verificar que Funcione

Antes de hacer preguntas, verifica la salud del módulo:

1. Haz click en **"GET /api/ai/health"**
2. Haz click en **"Try it out"**
3. Haz click en **"Execute"**

Deberías ver:
```json
{
  "status": "ok",
  "module": "ai"
}
```

## ¿Y si Algo Falla?

### "Message is required"
- No escribiste nada en el campo `message`
- Asegúrate de escribir una pregunta

### "NVIDIA_API_KEY not set"
- Agrega tu API key en `.env`:
```env
NVIDIA_API_KEY="tu_clave_aqui"
```
- Reinicia el servidor

### "readmeAgents.md not found"
- El archivo debe estar en la raíz del proyecto
- Verifica que exista: `C:\Users\rafa\Desktop\CRM TCC\CUSTOMER-CRM-BE\readmeAgents.md`

### Respuestas genéricas o "no disponible"
- La pregunta está fuera del alcance de readmeAgents.md
- Intenta con preguntas más específicas
- Verifica que readmeAgents.md esté actualizado

## Integración en Tu Aplicación

Una vez que veas que funciona en Swagger, usa el endpoint en tu aplicación:

### JavaScript/React
```javascript
async function preguntarAlAsistente(pregunta) {
  const response = await fetch('/api/ai/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: pregunta })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Respuesta:', data.response);
    console.log('Chunks usados:', data.metadata.chunksRetrieved);
  } else {
    console.error('Error:', data.error);
  }
}

// Uso
preguntarAlAsistente('¿Cuáles son los endpoints de clientes?');
```

### cURL
```bash
curl -X POST http://localhost:7000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Cómo crear una oportunidad?"}'
```

## 🎯 Resumen

✅ **Abre Swagger:** `http://localhost:7000/api/docs`
✅ **Busca:** Sección "AI & RAG"
✅ **Click en:** POST /api/ai/ask
✅ **Try it out**
✅ **Escribe tu pregunta**
✅ **Execute**
✅ **Lee la respuesta JSON**

¡Listo! Ya estás usando el asistente RAG 🚀

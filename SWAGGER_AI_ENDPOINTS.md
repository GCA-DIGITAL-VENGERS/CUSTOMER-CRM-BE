# 📚 Documentación Swagger - Endpoints AI

## Acceso a Swagger

Cuando ejecutes el servidor en desarrollo:

```bash
npm run dev
```

Abre el navegador en:

```
http://localhost:7000/api/docs
```

Verás la documentación completa de todos los endpoints, incluyendo los nuevos endpoints de AI.

## Endpoints Documentados

### 1. POST /api/ai/chat
Envía una pregunta al asistente RAG del CRM.

**En Swagger UI:**
- Busca la sección **"AI & RAG"**
- Expande **"POST /api/ai/chat"**
- Haz clic en **"Try it out"**

**Request Body:**
```json
{
  "message": "¿Cuáles son los endpoints disponibles para gestionar clientes?"
}
```

**Response Headers:**
- `Content-Type: text/event-stream`
- `X-Metadata-Chunks: 3`
- `X-Metadata-Intent: general`

**Response (SSE Streaming):**
```
data: {"type":"metadata","chunksRetrieved":3,"intent":"general"}

data: "El sistema CRM proporciona los siguientes endpoints para gestionar clientes:"

data: "..."

data: {"type":"done"}
```

### 2. GET /api/ai/health
Verifica que el módulo AI esté funcionando.

**En Swagger UI:**
- Busca la sección **"AI & RAG"**
- Expande **"GET /api/ai/health"**
- Haz clic en **"Try it out"**

**Response:**
```json
{
  "status": "ok",
  "module": "ai"
}
```

## Esquemas Documentados

### ChatMessage (Request)
```typescript
{
  message: string;  // max 5000 characters
}
```

Ejemplo:
```json
{
  "message": "¿Cuáles son los pasos para crear un nuevo cliente?"
}
```

### ChatResponse (Response SSE Events)
Tipos de eventos:

1. **metadata** - Al inicio, información sobre la búsqueda
```json
{
  "type": "metadata",
  "chunksRetrieved": 3,
  "intent": "general"
}
```

2. **content** - Tokens de la respuesta (en streaming)
```
"El sistema CRM..."
```

3. **done** - Señal de fin
```json
{
  "type": "done"
}
```

4. **error** - Si ocurre un error
```json
{
  "type": "error",
  "message": "Error description"
}
```

### HealthResponse
```json
{
  "status": "ok",
  "module": "ai"
}
```

## Probando en Swagger UI

### Paso 1: Abrir Swagger
```
http://localhost:7000/api/docs
```

### Paso 2: Ir a sección "AI & RAG"
Verás dos endpoints listados.

### Paso 3: Probar POST /api/ai/chat
1. Click en el endpoint
2. Click en "Try it out"
3. En el request body, escribe:
```json
{
  "message": "¿Cómo crear una oportunidad de ventas?"
}
```
4. Click en "Execute"
5. Verás la respuesta en streaming

### Paso 4: Probar GET /api/ai/health
1. Click en el endpoint
2. Click en "Try it out"
3. Click en "Execute"
4. Verás respuesta de salud

## Headers Personalizados

Los endpoints de AI retornan headers adicionales útiles:

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
X-Metadata-Chunks: 3
X-Metadata-Intent: general
Cache-Control: no-cache
Connection: keep-alive
```

- **X-Metadata-Chunks**: Cantidad de chunks de contexto usados
- **X-Metadata-Intent**: Intención detectada (how-to | data-query | general)

## Notas Importantes

1. **Streaming**: El endpoint `/api/ai/chat` retorna streaming SSE, no JSON tradicional. En Swagger verás los eventos línea por línea.

2. **Timeout**: Las respuestas pueden tardar algunos segundos mientras se genera el embedding y se llamada al LLM. El timeout por defecto es suficiente.

3. **API Key**: Necesitas tener `NVIDIA_API_KEY` configurado en `.env` para que funcione.

4. **Rate Limiting**: Sin límites de rate en desarrollo, pero considera implementar en producción.

## Ejemplos de Preguntas

Prueba estas preguntas en el endpoint:

- "¿Cuáles son los endpoints disponibles para gestionar clientes?"
- "¿Cómo crear una nueva oportunidad?"
- "¿Qué métricas proporciona el dashboard?"
- "¿Cuáles son los tipos de actividades que puedo registrar?"
- "Explícame el proceso para crear un cliente"

## Intenciones Detectadas

El sistema detecta automáticamente la intención de tu pregunta:

| Intención | Ejemplos |
|-----------|----------|
| `how-to` | "¿Cómo...", "¿Pasos para...", "Explícame..." |
| `data-query` | "¿Cuáles son...", "¿Cuántos...", "Listar..." |
| `general` | Otras preguntas generales |

La intención afecta cómo se construye el prompt y se busca el contexto.

## Solución de Problemas en Swagger

### No veo los endpoints de AI
- Asegúrate de que el servidor está ejecutándose
- Verifica que `aiRoutes` esté importado en `src/index.ts`
- Recarga la página de Swagger

### "Error: NVIDIA_API_KEY not set"
- Configura la variable en `.env`
- Reinicia el servidor con `npm run dev`

### Respuesta vacía o timeout
- Verifica tu conexión a internet
- Comprueba que tu API key es válida
- Revisa los logs del servidor en la terminal

### El streaming se ve raro en Swagger UI
Es normal. Swagger UI no está optimizado para SSE. Usa curl o un cliente HTTP para mejor visualización:

```bash
curl -X POST http://localhost:7000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"tu pregunta"}'
```

## Ver la Respuesta Completa

En Swagger UI, después de ejecutar, verás:

1. **Headers** - Información técnica (X-Metadata-*)
2. **Response body** - Los eventos SSE
3. **Response code** - 200 OK si es exitoso

Para una mejor experiencia con SSE, usa herramientas como:
- **curl** - CLI
- **Postman** - GUI con soporte SSE
- **Thunder Client** - VS Code extension
- Cliente JavaScript personalizado

## Integración en Documentación General

La documentación de los endpoints de AI está integrada en el Swagger general del CRM, bajo la sección **"AI & RAG"**.

Todos los demás endpoints (Auth, Clients, Contacts, etc.) siguen la misma estructura y pueden probarse de la misma manera.

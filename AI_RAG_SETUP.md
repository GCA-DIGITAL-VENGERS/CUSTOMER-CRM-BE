# 🧠 Sistema RAG - Módulo de Asistente Inteligente

## Descripción General

Módulo RAG (Retrieval-Augmented Generation) completamente integrado en la arquitectura hexagonal del CRM. Permite responder preguntas del usuario sobre las funcionalidades del sistema utilizando el archivo `readmeAgents.md` como fuente única de verdad.

## Arquitectura

### Estructura de Carpetas

```
src/
├── infrastructure/
│   └── ai/
│       ├── openai.client.ts        # Cliente OpenAI configurado para NVIDIA
│       ├── embedding.service.ts    # Servicio de embeddings y similitud
│       ├── rag.service.ts          # Orquestación del RAG
│       └── contextLoader.ts        # Cargador de readmeAgents.md
├── application/
│   └── use-cases/
│       └── ai/
│           └── chat.usecase.ts     # Use case de chat
└── interfaces/
    ├── controllers/
    │   └── aiController.ts         # Controller HTTP
    └── routes/
        └── aiRoutes.ts             # Rutas del módulo
```

## Configuración Requerida

### 1. Variable de Entorno

Asegúrate de establecer `NVIDIA_API_KEY` en tu `.env`:

```env
NVIDIA_API_KEY="tu_clave_api_nvidia_aqui"
```

### 2. Instalar Dependencias

```bash
npm install
```

Se agregó automáticamente `openai@^4.52.0` al `package.json`.

## Flujo de Funcionamiento

```
Usuario envía mensaje
    ↓
ChatUseCase valida input
    ↓
RAGService detecta intención (how-to, data-query, general)
    ↓
Genera embedding de la pregunta
    ↓
EmbeddingService busca chunks similares (cosine similarity)
    ↓
Retrieves top 3 chunks más relevantes
    ↓
Construye system prompt con contexto
    ↓
OpenAI chat API (minimaxai/minimax-m2.7) con streaming
    ↓
Controller envía respuesta en formato SSE (Server-Sent Events)
    ↓
Cliente recibe respuesta en tiempo real
```

## API Endpoint

### POST /api/ai/chat

Envía una pregunta al asistente RAG.

**Request Body:**
```json
{
  "message": "¿Cuáles son los endpoints disponibles para gestionar clientes?"
}
```

**Response (Streaming SSE):**
```
data: {"type":"metadata","chunksRetrieved":3,"intent":"general"}

data: "El sistema CRM proporciona los siguientes endpoints para gestionar clientes:\n\n1. **Crear cliente** - POST /api/clients"

data: "\n2. **Listar clientes** - GET /api/clients"

data: "\n3. **Ver cliente** - GET /api/clients/{id}"

...

data: {"type":"done"}
```

### GET /api/ai/health

Verifica que el módulo esté funcionando.

**Response:**
```json
{
  "status": "ok",
  "module": "ai"
}
```

## Componentes Principales

### 1. OpenAI Client (`infrastructure/ai/openai.client.ts`)

Configura el cliente OpenAI para usar NVIDIA API.

**Características:**
- Conecta a `https://integrate.api.nvidia.com/v1`
- Usa modelo `minimaxai/minimax-m2.7`
- Soporta streaming de respuestas
- Lee API key desde variable de entorno

**Uso:**
```typescript
import { openAIClient } from './infrastructure/ai/openai.client';

const response = await openAIClient.chat(messages, {
  temperature: 0.7,
  maxTokens: 1000
});
```

### 2. Embedding Service (`infrastructure/ai/embedding.service.ts`)

Genera embeddings vectoriales y calcula similitud.

**Métodos:**
- `embedText(text: string)` - Genera embedding de un texto
- `embedMultiple(texts: string[])` - Genera embeddings de múltiples textos
- `cosineSimilarity(vecA, vecB)` - Calcula similitud coseno

**Uso:**
```typescript
const embedding = await embeddingService.embedText("texto");
const similarity = embeddingService.cosineSimilarity(vec1, vec2);
```

### 3. Context Loader (`infrastructure/ai/contextLoader.ts`)

Carga y fragmenta el archivo `readmeAgents.md`.

**Características:**
- Lee archivo al inicializar
- Divide en chunks de ~800 caracteres
- Mantiene metadata (línea inicio/fin)
- Permite recargar contexto en runtime

**Uso:**
```typescript
const chunks = contextLoader.getChunks();
const content = contextLoader.getRawContent();
contextLoader.reload(); // Recargar archivo
```

### 4. RAG Service (`infrastructure/ai/rag.service.ts`)

Orquesta búsqueda semántica y construcción del prompt.

**Métodos:**
- `getRelevantChunks(query, topK)` - Busca chunks similares
- `chat(userMessage)` - Ejecuta ciclo completo RAG
- `detectIntent(query)` - Identifica tipo de pregunta

**Tipos de Intención:**
- `how-to` - Preguntas sobre procesos
- `data-query` - Consultas de datos
- `general` - Consultas generales

**Uso:**
```typescript
const { stream, retrievedChunks } = await ragService.chat("pregunta");

for await (const chunk of stream) {
  console.log(chunk.choices[0].delta.content);
}
```

### 5. Chat Use Case (`application/use-cases/ai/chat.usecase.ts`)

Valida input y orquesta la lógica de aplicación.

**Validaciones:**
- Mensaje no vacío
- Máximo 5000 caracteres
- Estructura de respuesta consistente

**Uso:**
```typescript
const result = await chatUseCase.execute({
  message: "pregunta"
});
```

### 6. AI Controller (`interfaces/controllers/aiController.ts`)

Maneja peticiones HTTP y streaming.

**Métodos:**
- `chat(req, res)` - Endpoint POST /api/ai/chat
- `health(req, res)` - Endpoint GET /api/ai/health

**Headers de Response:**
- `Content-Type: text/event-stream`
- `X-Metadata-Chunks: número de chunks`
- `X-Metadata-Intent: tipo de intención`

## Ejemplos de Uso

### Desde cURL

```bash
curl -X POST http://localhost:7000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Cuáles son los tipos de actividades que se pueden registrar?"}'
```

### Desde JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:7000/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Cómo crear un nuevo cliente'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  const lines = text.split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      console.log(data);
    }
  });
}
```

### Desde TypeScript

```typescript
import { chatUseCase } from './application/use-cases/ai/chat.usecase';

const result = await chatUseCase.execute({
  message: "¿Qué métricas muestra el dashboard?"
});

console.log('Intent:', result.metadata.intent);
console.log('Chunks retrievados:', result.metadata.retrievedChunksCount);

for await (const chunk of result.stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  if (content) {
    process.stdout.write(content);
  }
}
```

## Reglas del Asistente

El asistente cumple automáticamente estas reglas:

1. **Solo responde con contexto** - Las respuestas se basan únicamente en `readmeAgents.md`
2. **No inventa funcionalidades** - Si algo no está documentado, lo indica explícitamente
3. **Detecta intención** - Adapta respuestas según el tipo de pregunta
4. **Cita fuentes** - Los chunks retrievados son metadata de la respuesta
5. **Límites claros** - Rechaza preguntas fuera del alcance del sistema

## Personalización

### Cambiar Tamaño de Chunks

En `contextLoader.ts`, línea 22:

```typescript
this.chunks = this.splitIntoChunks(this.rawContent, 1000); // 1000 caracteres
```

### Cambiar Umbral de Similitud

En `rag.service.ts`, línea 13:

```typescript
private similarityThreshold = 0.3; // Rango: 0-1
```

### Cambiar Top K de Chunks Relevantes

En `rag.service.ts`, línea 12:

```typescript
private maxRetrievedChunks = 3; // Aumentar para más contexto
```

### Cambiar Parámetros LLM

En `rag.service.ts`, línea 58:

```typescript
const stream = await openAIClient.chat(messages, {
  temperature: 0.7,    // Más bajo = más determinístico
  maxTokens: 1000      // Respuestas más cortas/largas
});
```

## Limitaciones y Consideraciones

1. **Sin persistencia** - Los embeddings se generan en tiempo real. Para producción a escala, considera guardar embeddings en caché
2. **Una única fuente** - Solo usa `readmeAgents.md`. Actualizar ese archivo automáticamente actualiza el contexto
3. **Rate limiting** - NVIDIA API puede tener límites. Implementar rate limiting según necesidades
4. **Costos** - Cada pregunta genera embeddings y solicitudes al LLM. Monitorear consumo de API

## Solución de Problemas

### Error: "NVIDIA_API_KEY not found"

```bash
# Verificar que esté en .env
echo $NVIDIA_API_KEY

# Si no aparece, añadir a .env:
NVIDIA_API_KEY="tu_clave_aqui"
```

### Error: "readmeAgents.md not found"

```bash
# Verificar que el archivo existe en la raíz del proyecto
ls -la readmeAgents.md

# Si falta, crear desde template o copiar de la rama correcta
```

### Respuestas genéricas o sin contexto

- Aumentar `maxRetrievedChunks` en `rag.service.ts`
- Bajar `similarityThreshold` para aceptar chunks menos similares
- Revisar que `readmeAgents.md` esté actualizado

### Streaming se detiene antes de completar

- Aumentar `maxTokens` en el llamado a `openAIClient.chat()`
- Revisar logs de NVIDIA API por rate limiting
- Verificar conexión a internet

## Próximas Mejoras

- [ ] Caché de embeddings en Redis o PostgreSQL
- [ ] Histórico de conversaciones (multi-turn)
- [ ] Feedback del usuario para mejorar ranking de chunks
- [ ] Soporte para múltiples archivos de conocimiento
- [ ] Fine-tuning del modelo con datos específicos del CRM

## Referencias

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [NVIDIA API Integration](https://integrate.api.nvidia.com/v1)
- [RAG Overview](https://arxiv.org/abs/2005.11401)
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)

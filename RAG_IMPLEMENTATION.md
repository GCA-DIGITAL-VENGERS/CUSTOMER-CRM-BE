# 🧠 Implementación Completa del Módulo RAG

## Resumen Ejecutivo

Se ha implementado un sistema RAG (Retrieval-Augmented Generation) completamente integrado en la arquitectura hexagonal del CRM backend, permitiendo que los usuarios hagan preguntas sobre las funcionalidades del sistema a través de un asistente inteligente.

## ✅ Lo que se Implementó

### 1. **Estructura de Carpetas**

```
src/
├── domain/
│   └── ports/
│       ├── IChatAdapter.ts        # Puerto (interfaz) de dominio
│       └── README.md              # Documentación de puertos
│
├── application/
│   └── use-cases/
│       └── ai/
│           └── chat.usecase.ts    # Orquestación de lógica de negocio
│
└── infrastructure/
    ├── adapters/
    │   ├── ChatAdapter.ts         # Implementación del puerto
    │   └── README.md              # Documentación de adapters
    └── ai/
        ├── openai.client.ts       # Cliente OpenAI/NVIDIA
        ├── embedding.service.ts   # Servicio de embeddings
        ├── rag.service.ts         # Lógica RAG
        └── contextLoader.ts       # Cargador de contexto
```

### 2. **Componentes Core**

#### **OpenAI Client** (`infrastructure/ai/openai.client.ts`)
- Configura cliente OpenAI para usar NVIDIA API
- URL base: `https://integrate.api.nvidia.com/v1`
- Modelo: `minimaxai/minimax-m2.7`
- Soporta streaming de respuestas
- API key desde variable de entorno (seguro)

#### **Embedding Service** (`infrastructure/ai/embedding.service.ts`)
- Genera embeddings vectoriales usando NVIDIA NV-Embed
- Calcula similitud coseno entre vectores
- Métodos para embedding individual y múltiple
- Base para búsqueda semántica

#### **Context Loader** (`infrastructure/ai/contextLoader.ts`)
- Lee `readmeAgents.md` al inicializar
- Divide el contenido en chunks (~800 caracteres)
- Mantiene metadata (línea inicio/fin)
- Permite recarga en runtime

#### **RAG Service** (`infrastructure/ai/rag.service.ts`)
- Orquesta la búsqueda semántica
- Recupera top 3 chunks más relevantes
- Construye system prompt contextualizado
- Detecta intención de preguntas (how-to, data-query, general)
- Llama a OpenAI API con streaming

#### **Chat Adapter** (`infrastructure/adapters/ChatAdapter.ts`)
- Implementa el puerto `IChatAdapter`
- Transforma datos entre dominio e infraestructura
- Orquesta servicios de IA
- Invertible de dependencias

#### **Chat Use Case** (`application/use-cases/ai/chat.usecase.ts`)
- Lógica de aplicación pura
- Valida input (no vacío, máx 5000 chars)
- Recibe adapter por inyección de dependencias
- Retorna respuesta en stream

#### **AI Controller** (`interfaces/controllers/aiController.ts`)
- Maneja peticiones HTTP
- Implementa streaming SSE (Server-Sent Events)
- Retorna metadata en headers
- Gestiona errores

#### **AI Routes** (`interfaces/routes/aiRoutes.ts`)
- Rutas de la API
- `POST /api/ai/chat` - Enviar pregunta
- `GET /api/ai/health` - Verificar salud

### 3. **Patrones y Buenas Prácticas**

#### **Arquitectura Hexagonal**
```
┌─────────────────────────────────────────┐
│         Interfaces HTTP (Adapters)      │
├─────────────────────────────────────────┤
│       Application (Use Cases)            │
├─────────────────────────────────────────┤
│ Domain (Puertos/Interfaces)             │
├─────────────────────────────────────────┤
│    Infrastructure (Adapters técnicos)   │
└─────────────────────────────────────────┘
```

#### **Inyección de Dependencias**
```typescript
// Use case recibe implementación del puerto
export class ChatUseCase {
  constructor(private chatAdapter: IChatAdapter) {}
}

// Instanciación con adapter concreto
export const chatUseCase = new ChatUseCase(chatAdapter);
```

#### **SOLID Principles**
- ✅ **S** - Responsabilidad Única: Cada clase tiene un propósito
- ✅ **O** - Abierto/Cerrado: Extensible sin modificar código existente
- ✅ **L** - Liskov Substitution: ChatAdapter implementa IChatAdapter
- ✅ **I** - Segregación de Interfaz: Puertos mínimos y específicos
- ✅ **D** - Inversión de Dependencias: Depend de abstracciones, no de concreciones

### 4. **Flujo de Ejecución**

```
1. Cliente → POST /api/ai/chat { "message": "pregunta" }
                    ↓
2. AIController.chat()
                    ↓
3. ChatUseCase.execute(ChatMessage)
   - Valida input
                    ↓
4. ChatAdapter.chat(message)
                    ↓
5. RAGService.chat(message)
   - Detecta intención
   - Genera embedding de pregunta
   - Busca chunks similares (cosine similarity)
   - Construye system prompt
                    ↓
6. OpenAIClient.chat() con streaming
   - Llamada a NVIDIA API
   - Recibe tokens en streaming
                    ↓
7. Controller envía SSE events al cliente
   - Metadata: chunks retrievados, intención
   - Tokens de respuesta (stream)
   - Señal de fin
                    ↓
8. Cliente recibe respuesta en tiempo real
```

## 🚀 Cómo Usar

### Instalación

1. **Actualizar `.env`** con tu API key:
```env
NVIDIA_API_KEY="tu_clave_aqui"
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Compilar**:
```bash
npm run build
```

### Ejecución

#### Desarrollo
```bash
npm run dev
# Servidor en http://localhost:7000
```

#### Producción
```bash
npm run build
npm start
```

### Pruebas

#### Desde curl
```bash
curl -X POST http://localhost:7000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Cuáles son los endpoints de clientes?"}'
```

#### Script de pruebas
```bash
npm run test:rag
```

#### Desde cliente JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:7000/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'tu pregunta' })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  console.log(text); // Procesar streaming
}
```

## 📋 Endpoint Reference

### POST /api/ai/chat
Envía una pregunta al asistente RAG.

**Request:**
```json
{
  "message": "string (max 5000 chars)"
}
```

**Response (SSE):**
```
data: {"type":"metadata","chunksRetrieved":3,"intent":"general"}
data: "La respuesta del asistente..."
data: {"type":"done"}
```

**Headers de Response:**
- `Content-Type: text/event-stream`
- `X-Metadata-Chunks: 3`
- `X-Metadata-Intent: general`

### GET /api/ai/health
Verifica que el módulo esté operativo.

**Response:**
```json
{
  "status": "ok",
  "module": "ai"
}
```

## 🔧 Configuración Avanzada

### Cambiar tamaño de chunks
`contextLoader.ts`, línea 22:
```typescript
this.chunks = this.splitIntoChunks(this.rawContent, 1000); // bytes
```

### Cambiar umbral de similitud
`rag.service.ts`, línea 13:
```typescript
private similarityThreshold = 0.3; // 0-1
```

### Cambiar top K chunks
`rag.service.ts`, línea 12:
```typescript
private maxRetrievedChunks = 5;
```

### Cambiar parámetros LLM
`rag.service.ts`, línea 58:
```typescript
await openAIClient.chat(messages, {
  temperature: 0.5,  // 0-1, más bajo = determinístico
  maxTokens: 2000    // Límite de respuesta
});
```

## 📁 Archivos Creados

| Archivo | Propósito |
|---------|-----------|
| `src/domain/ports/IChatAdapter.ts` | Puerto/Interfaz del adaptador |
| `src/infrastructure/adapters/ChatAdapter.ts` | Implementación del puerto |
| `src/infrastructure/ai/openai.client.ts` | Cliente NVIDIA/OpenAI |
| `src/infrastructure/ai/embedding.service.ts` | Embeddings y similitud |
| `src/infrastructure/ai/rag.service.ts` | Lógica RAG core |
| `src/infrastructure/ai/contextLoader.ts` | Cargador de readmeAgents.md |
| `src/application/use-cases/ai/chat.usecase.ts` | Use case puro |
| `src/interfaces/controllers/aiController.ts` | Controller HTTP |
| `src/interfaces/routes/aiRoutes.ts` | Rutas API |
| `test-rag.ts` | Script de testing |
| `AI_RAG_SETUP.md` | Documentación detallada |
| `RAG_IMPLEMENTATION.md` | Este archivo |

## 🔐 Seguridad

✅ **API Keys**: Siempre desde variables de entorno, nunca hardcodeadas
✅ **Validación**: Input validado (tamaño máximo, no vacío)
✅ **Error Handling**: Errores capturados y reportados
✅ **Rate Limiting**: Considera implementar según necesidades

## ⚡ Performance

- **Embeddings**: Generados en tiempo real (considera caché para producción)
- **Búsqueda**: O(n) búsqueda lineal con similitud coseno (óptima para < 1000 chunks)
- **Streaming**: Respuesta en tiempo real al cliente
- **Memory**: Chunks mantenidos en memoria (~50MB para 1000+ chunks)

## 🐛 Solución de Problemas

### "NVIDIA_API_KEY not found"
Verifica que exista en `.env` y esté correctamente especificado.

### "readmeAgents.md not found"
El archivo debe estar en la raíz del proyecto.

### Respuestas genéricas
- Aumenta `maxRetrievedChunks`
- Disminuye `similarityThreshold`
- Verifica que `readmeAgents.md` esté actualizado

## 📚 Documentación Adicional

- `src/domain/ports/README.md` - Patrón de Puertos
- `src/infrastructure/adapters/README.md` - Patrón de Adapters
- `AI_RAG_SETUP.md` - Setup y configuración completa

## 🎯 Próximas Mejoras (Opcional)

- [ ] Caché de embeddings en Redis/PostgreSQL
- [ ] Histórico de conversaciones (multi-turn)
- [ ] Feedback del usuario para reranking
- [ ] Soporte para múltiples archivos de conocimiento
- [ ] Fine-tuning con datos del CRM
- [ ] Rate limiting y quotas

## 📞 Contacto & Soporte

Para dudas sobre la implementación, revisa:
1. `AI_RAG_SETUP.md` - Troubleshooting section
2. `src/domain/ports/README.md` - Patrones
3. `src/infrastructure/adapters/README.md` - Adapters

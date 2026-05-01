# Adapters (Implementaciones Concretas)

Los adapters implementan los puertos (interfaces) del dominio. Son las implementaciones técnicas concretas.

## Adapters Actuales

### ChatAdapter

Implementa `IChatAdapter` usando el servicio RAG con NVIDIA API.

**Responsabilidades:**
- Orquestar los servicios de IA (RAG, Embeddings, LLM)
- Transformar datos entre dominio e infraestructura
- Validar y processar responses

**Dependencias:**
- `RAGService` - Lógica de retrieval-augmented generation
- `ContextLoader` - Carga de readmeAgents.md

**Flujo:**
```
ChatAdapter.chat(message)
    ↓
RAGService.chat(message)
    ↓
RAGService.getRelevantChunks(message)
    ↓
EmbeddingService.embedText() → OpenAIClient
    ↓
Cosine similarity search
    ↓
OpenAIClient.chat() con streaming
    ↓
Return ChatResult
```

## Estructura

```
infrastructure/
├── adapters/
│   ├── ChatAdapter.ts           # Implementación principal
│   └── README.md                # Este archivo
├── ai/
│   ├── openai.client.ts         # Cliente OpenAI/NVIDIA
│   ├── embedding.service.ts     # Cálculo de embeddings
│   ├── rag.service.ts           # Lógica RAG
│   └── contextLoader.ts         # Cargador de contexto
└── database/
    └── ...
```

## Cómo Usar en Use Cases

```typescript
import { IChatAdapter } from '../domain/ports/IChatAdapter';
import { chatAdapter } from '../infrastructure/adapters/ChatAdapter';

export class ChatUseCase {
  constructor(private chatAdapter: IChatAdapter) {}
  
  async execute(message: string) {
    const result = await this.chatAdapter.chat(message);
    return result;
  }
}

// Instanciar con la implementación concreta
export const chatUseCase = new ChatUseCase(chatAdapter);
```

## Creando un Nuevo Adapter

1. Implementar la interfaz del puerto:

```typescript
import { IChatAdapter, ChatResult } from '../domain/ports/IChatAdapter';

export class MyCustomChatAdapter implements IChatAdapter {
  async chat(userMessage: string): Promise<ChatResult> {
    // Tu implementación aquí
  }
  
  detectIntent(query: string) {
    // Tu lógica aquí
  }
  
  async getRelevantChunks(query: string) {
    // Tu lógica aquí
  }
}
```

2. Registrar en el controlador:

```typescript
import { MyCustomChatAdapter } from '../adapters/MyCustomChatAdapter';

const myAdapter = new MyCustomChatAdapter();
export const chatUseCase = new ChatUseCase(myAdapter);
```

## Testing

Con esta arquitectura, es fácil hacer tests:

```typescript
describe('ChatUseCase', () => {
  it('should handle chat messages', async () => {
    const mockAdapter: IChatAdapter = {
      chat: jest.fn().mockResolvedValue({
        stream: mockStream,
        retrievedChunks: [],
        intent: 'general'
      }),
      detectIntent: jest.fn().returnValue('general'),
      getRelevantChunks: jest.fn().resolvedValue([])
    };
    
    const useCase = new ChatUseCase(mockAdapter);
    const result = await useCase.execute({ message: 'test' });
    
    expect(mockAdapter.chat).toHaveBeenCalledWith('test');
  });
});
```

## Beneficios del Patrón Adapter

✅ **Desacoplamiento** - Cambiar implementaciones sin afectar use cases
✅ **Testabilidad** - Mockeables para unit tests
✅ **Escalabilidad** - Agregar múltiples adapters sin modificar dominio
✅ **Mantenibilidad** - Cambios en infraestructura no impactan la lógica de negocio

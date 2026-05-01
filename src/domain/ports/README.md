# Ports (Interfaces) - Capa de Dominio

Los puertos definen los contratos que los adaptadores deben implementar. Esto mantiene el dominio independiente de las implementaciones técnicas.

## Puertos Actuales

### IChatAdapter

Define el contrato para cualquier implementación de asistente de chat RAG.

**Responsabilidades:**
- Procesar mensajes del usuario
- Detectar intención de las preguntas
- Recuperar chunks relevantes

**Métodos:**
- `chat(userMessage: string): Promise<ChatResult>`
- `detectIntent(query: string): 'how-to' | 'data-query' | 'general'`
- `getRelevantChunks(query: string, topK?: number): Promise<Chunk[]>`

**Implementaciones:**
- `infrastructure/adapters/ChatAdapter.ts` - Implementación RAG con NVIDIA API

## Patrones

### Inyección de Dependencias

```typescript
export class ChatUseCase {
  constructor(private chatAdapter: IChatAdapter) {}
  
  async execute(input: ChatMessage): Promise<ChatResponse> {
    const { stream, retrievedChunks, intent } = await this.chatAdapter.chat(
      input.message
    );
    // ...
  }
}

// En el punto de entrada
import { chatAdapter } from '../adapters/ChatAdapter';
export const chatUseCase = new ChatUseCase(chatAdapter);
```

## Ventajas

✅ **Inversión de Dependencias** - El use case depende de abstracciones, no de implementaciones
✅ **Testabilidad** - Fácil crear mocks del adapter para tests
✅ **Extensibilidad** - Nuevas implementaciones sin modificar el dominio
✅ **Arquitectura Limpia** - El dominio no conoce detalles técnicos

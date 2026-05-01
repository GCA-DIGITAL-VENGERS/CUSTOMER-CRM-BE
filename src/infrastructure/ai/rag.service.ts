import { contextLoader, Chunk } from './contextLoader';
import { openAIClient } from './openai.client';
import OpenAI from 'openai';

export interface ChunkWithScore {
  chunk: Chunk;
  score: number;
}

export interface RAGResponse {
  stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
  retrievedChunks: Chunk[];
}

export class RAGService {
  private maxRetrievedChunks = 3;

  private keywordSimilarity(query: string, text: string): number {
    const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const textWords = text.toLowerCase().split(/\s+/);

    if (queryWords.length === 0) return 0;

    const matches = queryWords.filter((qw) =>
      textWords.some((tw) => tw.includes(qw) || qw.includes(tw))
    ).length;

    return matches / queryWords.length;
  }

  async getRelevantChunks(query: string, topK: number = 3): Promise<ChunkWithScore[]> {
    const chunks = contextLoader.getChunks();

    const chunksWithScores: ChunkWithScore[] = chunks
      .map((chunk) => ({
        chunk,
        score: this.keywordSimilarity(query, chunk.content),
      }))
      .filter((cs) => cs.score > 0);

    chunksWithScores.sort((a, b) => b.score - a.score);
    return chunksWithScores.slice(0, topK);
  }

  private buildSystemPrompt(retrievedChunks: Chunk[]): string {
    const context = retrievedChunks
      .map((chunk, index) => `### Información ${index + 1}:\n${chunk.content}`)
      .join('\n\n---\n\n');

    return `Eres un asistente inteligente de un sistema CRM.

Tu función es ayudar al usuario a gestionar clientes, contactos, oportunidades y actividades de forma clara, útil y conversacional.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTEXTO DE CONVERSACIÓN:

• Debes tener en cuenta todo el historial del chat antes de responder
• Si el usuario hace referencia a algo anterior (ej: "ese cliente", "lo anterior"), debes inferir el contexto correctamente
• No repitas información innecesaria si ya fue explicada antes
• Da continuidad natural a la conversación

MEMORIA:

• Mantén en cuenta entidades mencionadas (clientes, contactos, oportunidades)
• Si el usuario menciona un cliente, asume que seguirá siendo relevante hasta que diga lo contrario
• Recuerda qué funcionalidades ya han sido explicadas para no repetir

ESTILO DE RESPUESTA:

• Lenguaje claro, cercano y profesional (como un colega que te ayuda)
• Enfocado en funcionalidades, NO en detalles técnicos
• Explica qué puede hacer el usuario, no cómo funciona internamente
• Sé útil, no redundante
• Responde directamente sin introducciones innecesarias

REGLAS IMPORTANTES:

✗ NO menciones endpoints, rutas, APIs ni detalles técnicos
✗ NO muestres código ni implementaciones
✗ NO repitas explicaciones que ya diste
✗ NO inventes funcionalidades que no existan
✗ NO uses jerga técnica

COMPORTAMIENTO INTELIGENTE:

✓ Puedes sugerir acciones útiles según el contexto
✓ Puedes anticiparte a necesidades del usuario
✓ Si falta contexto, pide aclaración de forma natural y fluida
✓ Conecta las respuestas con lo que el usuario preguntó antes
✓ Sé proactivo: si el usuario habla de un cliente, sugiere qué podría hacer después

ESTRUCTURA DE RESPUESTA (cuando sea necesario):

[Bloque 1: Nombre funcionalidad]
Lo que puedes hacer: descripción directa
Para qué sirve: beneficio o caso de uso

[Bloque 2: Nombre funcionalidad]
Lo que puedes hacer: descripción directa
Para qué sirve: beneficio o caso de uso

OBJETIVO:

Que la conversación se sienta como hablar con un asistente real que recuerda, entiende y ayuda activamente. El usuario no debe sentir que está hablando con un bot o leyendo documentación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INFORMACIÓN DEL SISTEMA (Fuente de verdad):

${context}`;
  }

  async chat(
    userMessage: string,
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<RAGResponse> {
    const relevantChunks = await this.getRelevantChunks(userMessage, this.maxRetrievedChunks);

    const retrievedChunks = relevantChunks.map((cs) => cs.chunk);

    const systemPrompt = this.buildSystemPrompt(retrievedChunks);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(
        ...conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }))
      );
    }

    messages.push({
      role: 'user',
      content: userMessage,
    });

    const stream = await openAIClient.chat(messages, { temperature: 0.7, maxTokens: 1000 });

    return {
      stream,
      retrievedChunks,
    };
  }

  detectIntent(
    query: string
  ): 'how-to' | 'data-query' | 'general' {
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes('cómo') ||
      lowerQuery.includes('como') ||
      lowerQuery.includes('how') ||
      lowerQuery.includes('pasos') ||
      lowerQuery.includes('paso')
    ) {
      return 'how-to';
    }

    if (
      lowerQuery.includes('datos') ||
      lowerQuery.includes('data') ||
      lowerQuery.includes('consultar') ||
      lowerQuery.includes('listar') ||
      lowerQuery.includes('cuántos') ||
      lowerQuery.includes('cuantos')
    ) {
      return 'data-query';
    }

    return 'general';
  }
}

export const ragService = new RAGService();

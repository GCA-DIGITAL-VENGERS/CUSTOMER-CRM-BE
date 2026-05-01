import {
  IChatAdapter,
  ChatResult,
  Chunk,
} from '../../domain/ports/IChatAdapter';
import { ragService } from '../ai/rag.service';
import { contextLoader, Chunk as RAGChunk } from '../ai/contextLoader';

export class ChatAdapter implements IChatAdapter {
  async chat(
    userMessage: string,
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<ChatResult> {
    const intent = this.detectIntent(userMessage);
    const { stream, retrievedChunks } = await ragService.chat(userMessage, conversationHistory);

    const chunks: Chunk[] = retrievedChunks.map((chunk: RAGChunk) => ({
      id: chunk.id,
      content: chunk.content,
      startLine: chunk.startLine,
      endLine: chunk.endLine,
    }));

    return {
      stream,
      retrievedChunks: chunks,
      intent,
    };
  }

  detectIntent(
    query: string
  ): 'how-to' | 'data-query' | 'general' {
    return ragService.detectIntent(query);
  }

  async getRelevantChunks(query: string, topK: number = 3): Promise<Chunk[]> {
    const result = await ragService.getRelevantChunks(query, topK);

    return result.map((cs) => ({
      id: cs.chunk.id,
      content: cs.chunk.content,
      startLine: cs.chunk.startLine,
      endLine: cs.chunk.endLine,
    }));
  }
}

export const chatAdapter = new ChatAdapter();

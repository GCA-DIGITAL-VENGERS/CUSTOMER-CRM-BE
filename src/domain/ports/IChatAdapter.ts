import OpenAI from 'openai';

export interface Chunk {
  id: string;
  content: string;
  startLine: number;
  endLine: number;
}

export interface ChatResult {
  stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
  retrievedChunks: Chunk[];
  intent: 'how-to' | 'data-query' | 'general';
}

export interface IChatAdapter {
  chat(
    userMessage: string,
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<ChatResult>;
  detectIntent(query: string): 'how-to' | 'data-query' | 'general';
  getRelevantChunks(query: string, topK?: number): Promise<Chunk[]>;
}

import OpenAI from 'openai';
import { IChatAdapter } from '../../../domain/ports/IChatAdapter';

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
  metadata: {
    retrievedChunksCount: number;
    intent: 'how-to' | 'data-query' | 'general';
  };
}

export class ChatUseCase {
  constructor(private chatAdapter: IChatAdapter) {}

  async execute(input: ChatMessage): Promise<ChatResponse> {
    if (!input.message || input.message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (input.message.length > 5000) {
      throw new Error('Message exceeds maximum length of 5000 characters');
    }

    const { stream, retrievedChunks, intent } = await this.chatAdapter.chat(
      input.message
    );

    return {
      stream,
      metadata: {
        retrievedChunksCount: retrievedChunks.length,
        intent,
      },
    };
  }
}

import { chatAdapter } from '../../../infrastructure/adapters/ChatAdapter';

export const chatUseCase = new ChatUseCase(chatAdapter);

import OpenAI from 'openai';
import { IChatAdapter } from '../../../domain/ports/IChatAdapter';
import { IChatConversationRepository } from '../../../domain/repositories/IChatConversationRepository';

export interface ChatWithHistoryInput {
  message: string;
  conversationId?: string;
}

export interface ChatWithHistoryResponse {
  stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
  metadata: {
    retrievedChunksCount: number;
    intent: 'how-to' | 'data-query' | 'general';
    conversationId: string;
  };
}

export class ChatWithHistoryUseCase {
  constructor(
    private chatAdapter: IChatAdapter,
    private conversationRepository: IChatConversationRepository
  ) {}

  async execute(input: ChatWithHistoryInput): Promise<ChatWithHistoryResponse> {
    if (!input.message || input.message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (input.message.length > 5000) {
      throw new Error('Message exceeds maximum length of 5000 characters');
    }

    let conversationId = input.conversationId;
    let conversation;

    if (!conversationId) {
      conversation = await this.conversationRepository.create();
      conversationId = conversation.id;
    } else {
      conversation = await this.conversationRepository.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
    }

    const conversationHistory = conversation
      .getMessages()
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    const { stream, retrievedChunks } = await this.chatAdapter.chat(
      input.message,
      conversationHistory
    );

    await this.conversationRepository.addMessage(conversationId, 'user', input.message);

    let fullResponse = '';
    const repo = this.conversationRepository;

    const modifiedStream = (async function* () {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
        }
        yield chunk;
      }

      if (fullResponse) {
        await repo.addMessage(conversationId, 'assistant', fullResponse);
      }
    })();

    return {
      stream: modifiedStream as any,
      metadata: {
        retrievedChunksCount: retrievedChunks.length,
        intent: this.chatAdapter.detectIntent(input.message),
        conversationId,
      },
    };
  }
}

import { chatAdapter } from '../../../infrastructure/adapters/ChatAdapter';
import { chatConversationRepository } from '../../../infrastructure/repositories/chatConversationRepository';

export const chatWithHistoryUseCase = new ChatWithHistoryUseCase(
  chatAdapter,
  chatConversationRepository
);

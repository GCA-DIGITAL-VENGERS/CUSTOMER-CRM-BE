import prisma from '../database/prismaClient';
import { ChatConversation, ChatMessage } from '../../domain/entities/ChatConversation';
import { IChatConversationRepository } from '../../domain/repositories/IChatConversationRepository';

export class ChatConversationRepository implements IChatConversationRepository {
  async create(): Promise<ChatConversation> {
    const conversation = await prisma.chatConversation.create({
      data: {
        messages: {
          create: [],
        },
      },
      include: {
        messages: true,
      },
    });

    return new ChatConversation(
      conversation.id,
      conversation.messages.map((m: any) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        createdAt: m.createdAt,
      })),
      conversation.createdAt,
      conversation.updatedAt
    );
  }

  async findById(id: string): Promise<ChatConversation | null> {
    const conversation = await prisma.chatConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) return null;

    return new ChatConversation(
      conversation.id,
      conversation.messages.map((m: any) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        createdAt: m.createdAt,
      })),
      conversation.createdAt,
      conversation.updatedAt
    );
  }

  async addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<ChatMessage> {
    const message = await prisma.chatMessage.create({
      data: {
        conversationId,
        role,
        content,
      },
    });

    return {
      id: message.id,
      role: message.role as 'user' | 'assistant',
      content: message.content,
      createdAt: message.createdAt,
    };
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((m: any) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      createdAt: m.createdAt,
    }));
  }

  async getLastMessages(conversationId: string, limit: number): Promise<ChatMessage[]> {
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: Math.max(0, await this.getMessageCount(conversationId) - limit),
    });

    return messages.map((m: any) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      createdAt: m.createdAt,
    }));
  }

  private async getMessageCount(conversationId: string): Promise<number> {
    return prisma.chatMessage.count({
      where: { conversationId },
    });
  }

  async deleteConversation(id: string): Promise<void> {
    await prisma.chatConversation.delete({
      where: { id },
    });
  }
}

export const chatConversationRepository = new ChatConversationRepository();

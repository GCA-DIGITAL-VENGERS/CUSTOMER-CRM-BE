import { ChatConversation, ChatMessage } from '../entities/ChatConversation';

export interface IChatConversationRepository {
  create(): Promise<ChatConversation>;
  findById(id: string): Promise<ChatConversation | null>;
  addMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage>;
  getMessages(conversationId: string): Promise<ChatMessage[]>;
  getLastMessages(conversationId: string, limit: number): Promise<ChatMessage[]>;
  deleteConversation(id: string): Promise<void>;
}

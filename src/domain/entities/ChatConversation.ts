export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

export class ChatConversation {
  constructor(
    public id: string,
    public messages: ChatMessage[],
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  addMessage(role: 'user' | 'assistant', content: string): ChatMessage {
    const message: ChatMessage = {
      role,
      content,
      createdAt: new Date(),
    };
    this.messages.push(message);
    this.updatedAt = new Date();
    return message;
  }

  getMessages(): ChatMessage[] {
    return this.messages;
  }

  getLastNMessages(n: number): ChatMessage[] {
    return this.messages.slice(-n);
  }
}

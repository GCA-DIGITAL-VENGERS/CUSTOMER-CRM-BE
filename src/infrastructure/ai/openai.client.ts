import OpenAI from 'openai';

export class OpenAIClient {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    this.client = new OpenAI({
      apiKey,
    });
  }

  getClient(): OpenAI {
    return this.client;
  }

  async chat(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    options?: { temperature?: number; maxTokens?: number }
  ) {
    return this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
      stream: true,
    });
  }
}

export const openAIClient = new OpenAIClient();

import { Request, Response } from 'express';
import { chatUseCase } from '../../application/use-cases/ai/chat.usecase';
import { chatWithHistoryUseCase } from '../../application/use-cases/ai/chatWithHistory.usecase';

export class AIController {
  async chat(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const result = await chatUseCase.execute({ message });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('X-Metadata-Chunks', result.metadata.retrievedChunksCount.toString());
      res.setHeader('X-Metadata-Intent', result.metadata.intent);

      res.write(`data: {"type":"metadata","chunksRetrieved":${result.metadata.retrievedChunksCount},"intent":"${result.metadata.intent}"}\n\n`);

      for await (const event of result.stream) {
        const content = event.choices[0]?.delta?.content || '';

        if (content) {
          const escapedContent = JSON.stringify(content);
          res.write(`data: ${escapedContent}\n\n`);
        }
      }

      res.write(`data: {"type":"done"}\n\n`);
      res.end();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Chat error:', error);

      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: message });
      } else {
        res.write(`data: {"type":"error","message":"${message}"}\n\n`);
        res.end();
      }
    }
  }

  async ask(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const result = await chatUseCase.execute({ message });

      let fullResponse = '';
      for await (const event of result.stream) {
        const content = event.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
        }
      }

      res.json({
        success: true,
        message,
        response: fullResponse,
        metadata: {
          chunksRetrieved: result.metadata.retrievedChunksCount,
          intent: result.metadata.intent,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Ask error:', error);
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  async askWithHistory(req: Request, res: Response): Promise<void> {
    try {
      const { message, conversationId } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const result = await chatWithHistoryUseCase.execute({
        message,
        conversationId,
      });

      let fullResponse = '';
      for await (const event of result.stream) {
        const content = event.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
        }
      }

      res.json({
        success: true,
        message,
        response: fullResponse,
        metadata: {
          chunksRetrieved: result.metadata.retrievedChunksCount,
          intent: result.metadata.intent,
          conversationId: result.metadata.conversationId,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Ask with history error:', error);
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  async health(_req: Request, res: Response): Promise<void> {
    try {
      res.json({ status: 'ok', module: 'ai' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
}

export const aiController = new AIController();

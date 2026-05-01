import fs from 'fs';
import path from 'path';

export interface Chunk {
  id: string;
  content: string;
  startLine: number;
  endLine: number;
}

export class ContextLoader {
  private chunks: Chunk[] = [];
  private rawContent: string = '';

  constructor() {
    this.loadContext();
  }

  private loadContext(): void {
    const filePath = path.join(process.cwd(), 'readmeAgents.md');

    if (!fs.existsSync(filePath)) {
      throw new Error(`readmeAgents.md not found at ${filePath}`);
    }

    this.rawContent = fs.readFileSync(filePath, 'utf-8');
    this.chunks = this.splitIntoChunks(this.rawContent);
  }

  private splitIntoChunks(content: string, chunkSize: number = 800): Chunk[] {
    const lines = content.split('\n');
    const chunks: Chunk[] = [];
    let currentChunk = '';
    let startLine = 0;
    let chunkId = 0;

    for (let i = 0; i < lines.length; i++) {
      currentChunk += lines[i] + '\n';

      if (currentChunk.length >= chunkSize || i === lines.length - 1) {
        if (currentChunk.trim().length > 0) {
          chunks.push({
            id: `chunk-${chunkId}`,
            content: currentChunk.trim(),
            startLine,
            endLine: i,
          });
          chunkId++;
        }

        currentChunk = '';
        startLine = i + 1;
      }
    }

    return chunks;
  }

  getChunks(): Chunk[] {
    return this.chunks;
  }

  getRawContent(): string {
    return this.rawContent;
  }

  getChunkById(id: string): Chunk | undefined {
    return this.chunks.find((chunk) => chunk.id === id);
  }

  reload(): void {
    this.loadContext();
  }
}

export const contextLoader = new ContextLoader();

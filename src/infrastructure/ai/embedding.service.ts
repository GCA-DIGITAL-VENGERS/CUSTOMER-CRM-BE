export interface EmbeddingResult {
  text: string;
  embedding: number[];
}

export class EmbeddingService {
  private cache: Map<string, number[]> = new Map();

  generateEmbedding(text: string): number[] {
    if (this.cache.has(text)) {
      return this.cache.get(text)!;
    }

    const normalized = text.toLowerCase().trim();
    const vector: number[] = [];

    for (let i = 0; i < 384; i++) {
      let hash = 0;
      for (let j = 0; j < normalized.length; j++) {
        const char = normalized.charCodeAt(j);
        hash = (hash << 5) - hash + char + i;
        hash = hash & hash;
      }

      const value = Math.sin(hash / 10000 + i / 384) * 0.5 + 0.5;
      vector.push(value);
    }

    this.cache.set(text, vector);
    return vector;
  }

  async embedText(text: string): Promise<number[]> {
    return this.generateEmbedding(text);
  }

  async embedMultiple(texts: string[]): Promise<EmbeddingResult[]> {
    return texts.map((text) => ({
      text,
      embedding: this.generateEmbedding(text),
    }));
  }

  cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const embeddingService = new EmbeddingService();

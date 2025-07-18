import { Pinecone } from '@pinecone-database/pinecone';
import { googleAIService } from './googleAIService';
import { documentParsingService } from './documentParsingService';

export interface DocumentChunk {
  id: string;
  text: string;
  metadata: {
    filename: string;
    chunkIndex: number;
    category: string;
    uploadDate: string;
    size: number;
  };
}

export interface DocumentEmbedding {
  id: string;
  values: number[];
  metadata: {
    text: string;
    filename: string;
    chunkIndex: number;
    category: string;
    uploadDate: string;
    size: number;
  };
}

class PineconeService {
  private indexName: string;
  private index: any;
  private pinecone: Pinecone | null = null;

  constructor(indexName: string = 'knowledge-base') {
    this.indexName = indexName;
  }

  private initializePinecone() {
    if (this.pinecone) return this.pinecone;

    const apiKey = import.meta.env.VITE_PINECONE_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'Pinecone API key is required. Please set VITE_PINECONE_API_KEY in your environment variables. ' +
        'You can find your API key in the Pinecone developer console at https://app.pinecone.io'
      );
    }

    this.pinecone = new Pinecone({ apiKey });
    return this.pinecone;
  }

  private async initializeIndex() {
    try {
      const pinecone = this.initializePinecone();
      this.index = pinecone.index(this.indexName);
      console.log(`Connected to Pinecone index: ${this.indexName}`);
    } catch (error) {
      console.error('Error initializing Pinecone index:', error);
      throw error;
    }
  }

  private async generateEmbeddings(text: string): Promise<number[]> {
    try {
      return await googleAIService.generateEmbedding(text);
    } catch (error) {
      console.error('Error generating embeddings with Google AI:', error);
      // Fallback to mock embeddings
      console.log('Falling back to mock embeddings');
      return Array.from({ length: 768 }, () => Math.random() - 0.5);
    }
  }

  private chunkDocument(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    return documentParsingService.chunkText(text, chunkSize, overlap);
  }

  async storeDocumentEmbeddings(
    documentText: string,
    filename: string,
    category: string,
    documentId: string
  ): Promise<{ success: boolean; chunksStored: number }> {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      // Chunk the document
      const chunks = this.chunkDocument(documentText);
      console.log(`Processing ${chunks.length} chunks for document: ${filename}`);

      const embeddings: DocumentEmbedding[] = [];

      // Generate embeddings for each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunkText = chunks[i];
        const embeddingValues = await this.generateEmbeddings(chunkText);

        embeddings.push({
          id: `${documentId}_chunk_${i}`,
          values: embeddingValues,
          metadata: {
            text: chunkText,
            filename,
            chunkIndex: i,
            category,
            uploadDate: new Date().toISOString(),
            size: chunkText.length,
          },
        });
      }

      // Store in Pinecone
      await this.index.upsert(embeddings);

      console.log(`Successfully stored ${embeddings.length} embeddings for ${filename}`);
      return { success: true, chunksStored: embeddings.length };

    } catch (error) {
      console.error('Error storing document embeddings:', error);
      return { success: false, chunksStored: 0 };
    }
  }

  async searchSimilarDocuments(
    query: string,
    topK: number = 5,
    category?: string
  ): Promise<{
    matches: Array<{
      id: string;
      score: number;
      text: string;
      filename: string;
      category: string;
    }>;
  }> {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbeddings(query);

      // Build filter for category if specified
      const filter = category && category !== 'all' ? { category } : undefined;

      // Search in Pinecone
      const searchResults = await this.index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        filter,
      });

      // Format results
      const matches = searchResults.matches?.map((match: any) => ({
        id: match.id,
        score: match.score,
        text: match.metadata?.text || '',
        filename: match.metadata?.filename || '',
        category: match.metadata?.category || '',
      })) || [];

      console.log(`Found ${matches.length} similar documents for query: ${query}`);
      return { matches };

    } catch (error) {
      console.error('Error searching similar documents:', error);
      return { matches: [] };
    }
  }

  async deleteDocumentEmbeddings(documentId: string): Promise<boolean> {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      // Delete all chunks for this document
      await this.index.deleteMany({ 
        filter: { 
          filename: { $eq: documentId } 
        } 
      });

      console.log(`Deleted embeddings for document: ${documentId}`);
      return true;

    } catch (error) {
      console.error('Error deleting document embeddings:', error);
      return false;
    }
  }

  async getIndexStats(): Promise<{
    totalVectors: number;
    dimension: number;
    indexFullness: number;
  }> {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      const stats = await this.index.describeIndexStats();
      
      return {
        totalVectors: stats.totalVectorCount || 0,
        dimension: stats.dimension || 1536,
        indexFullness: stats.indexFullness || 0,
      };

    } catch (error) {
      console.error('Error getting index stats:', error);
      return {
        totalVectors: 0,
        dimension: 1536,
        indexFullness: 0,
      };
    }
  }
}

export const pineconeService = new PineconeService();
export default PineconeService;


import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.VITE_PINECONE_API_KEY || '',
});

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

  constructor(indexName: string = 'knowledge-base') {
    this.indexName = indexName;
    this.initializeIndex();
  }

  private async initializeIndex() {
    try {
      this.index = pinecone.index(this.indexName);
      console.log(`Connected to Pinecone index: ${this.indexName}`);
    } catch (error) {
      console.error('Error initializing Pinecone index:', error);
      throw new Error('Failed to initialize Pinecone index');
    }
  }

  // Generate embeddings using OpenAI (you'll need to implement this)
  private async generateEmbeddings(text: string): Promise<number[]> {
    // This is a placeholder - you'll need to integrate with OpenAI's embedding API
    // For now, returning mock embeddings
    console.log('Generating embeddings for text:', text.substring(0, 100) + '...');
    
    // Mock embedding - in production, use OpenAI's text-embedding-ada-002
    return Array.from({ length: 1536 }, () => Math.random() - 0.5);
  }

  // Chunk document into smaller pieces
  private chunkDocument(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start = end - overlap;
      
      if (start >= text.length) break;
    }

    return chunks;
  }

  // Store document embeddings in Pinecone
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

  // Search for similar documents/chunks
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

  // Delete document embeddings
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

  // Get document statistics
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

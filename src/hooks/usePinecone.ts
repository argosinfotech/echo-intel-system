
import { useState, useCallback } from 'react';
import { pineconeService, DocumentChunk } from '@/services/pineconeService';
import { useToast } from '@/hooks/use-toast';

export const usePinecone = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const storeDocument = useCallback(async (
    documentText: string,
    filename: string,
    category: string,
    documentId: string
  ) => {
    setIsProcessing(true);
    try {
      const result = await pineconeService.storeDocumentEmbeddings(
        documentText,
        filename,
        category,
        documentId
      );

      if (result.success) {
        toast({
          title: "Document processed",
          description: `Successfully processed ${result.chunksStored} chunks from ${filename}`,
        });
      } else {
        toast({
          title: "Processing failed",
          description: `Failed to process document: ${filename}`,
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the document",
        variant: "destructive",
      });
      return { success: false, chunksStored: 0 };
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const searchDocuments = useCallback(async (
    query: string,
    topK: number = 5,
    category?: string
  ) => {
    setIsSearching(true);
    try {
      const results = await pineconeService.searchSimilarDocuments(query, topK, category);
      return results;
    } catch (error) {
      toast({
        title: "Search failed",
        description: "An error occurred while searching documents",
        variant: "destructive",
      });
      return { matches: [] };
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      const success = await pineconeService.deleteDocumentEmbeddings(documentId);
      
      if (success) {
        toast({
          title: "Document deleted",
          description: "Document embeddings have been removed from the vector database",
        });
      } else {
        toast({
          title: "Deletion failed",
          description: "Failed to delete document embeddings",
          variant: "destructive",
        });
      }

      return success;
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the document",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const getIndexStats = useCallback(async () => {
    try {
      return await pineconeService.getIndexStats();
    } catch (error) {
      console.error('Error getting index stats:', error);
      return {
        totalVectors: 0,
        dimension: 1536,
        indexFullness: 0,
      };
    }
  }, []);

  return {
    storeDocument,
    searchDocuments,
    deleteDocument,
    getIndexStats,
    isProcessing,
    isSearching,
  };
};

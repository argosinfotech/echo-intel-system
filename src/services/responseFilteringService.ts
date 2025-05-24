
interface FilteredResponse {
  content: string;
  confidence: number;
  flags: string[];
  isAppropriate: boolean;
}

class ResponseFilteringService {
  
  filterResponse(response: string, query: string, context: string[]): FilteredResponse {
    console.log('Filtering response for appropriateness and relevance');
    
    const flags: string[] = [];
    let confidence = 1.0;
    
    // Check for inappropriate content
    const isAppropriate = this.checkAppropriateContent(response, flags);
    
    // Check relevance to query
    const relevanceScore = this.checkRelevance(response, query, context);
    if (relevanceScore < 0.3) {
      flags.push('low_relevance');
      confidence *= 0.7;
    }
    
    // Check for factual consistency
    const consistencyScore = this.checkConsistency(response, context);
    if (consistencyScore < 0.5) {
      flags.push('potential_inconsistency');
      confidence *= 0.8;
    }
    
    // Check response length and completeness
    if (response.length < 50) {
      flags.push('too_short');
      confidence *= 0.9;
    } else if (response.length > 2000) {
      flags.push('too_long');
      confidence *= 0.95;
    }
    
    // Filter out harmful or inappropriate content
    const filteredContent = isAppropriate ? response : this.generateSafeResponse(query);
    
    return {
      content: filteredContent,
      confidence,
      flags,
      isAppropriate
    };
  }

  private checkAppropriateContent(response: string, flags: string[]): boolean {
    const inappropriatePatterns = [
      /\b(hate|violence|discrimination)\b/i,
      /\b(illegal|harmful|dangerous)\b/i,
      /\b(password|secret|confidential)\b/i
    ];
    
    for (const pattern of inappropriatePatterns) {
      if (pattern.test(response)) {
        flags.push('inappropriate_content');
        return false;
      }
    }
    
    return true;
  }

  private checkRelevance(response: string, query: string, context: string[]): number {
    const queryWords = query.toLowerCase().split(' ');
    const responseWords = response.toLowerCase().split(' ');
    
    let matchCount = 0;
    for (const word of queryWords) {
      if (word.length > 3 && responseWords.includes(word)) {
        matchCount++;
      }
    }
    
    return queryWords.length > 0 ? matchCount / queryWords.length : 0;
  }

  private checkConsistency(response: string, context: string[]): number {
    // Simple consistency check - in production, use more sophisticated methods
    if (context.length === 0) return 1.0;
    
    const responseWords = new Set(response.toLowerCase().split(' '));
    let totalOverlap = 0;
    
    for (const contextChunk of context) {
      const contextWords = new Set(contextChunk.toLowerCase().split(' '));
      const overlap = new Set([...responseWords].filter(word => contextWords.has(word)));
      totalOverlap += overlap.size;
    }
    
    return Math.min(totalOverlap / responseWords.size, 1.0);
  }

  private generateSafeResponse(query: string): string {
    return `I apologize, but I cannot provide a response to that query as it may contain inappropriate content or requests. Please rephrase your question in a more appropriate way, and I'll be happy to help you find the information you need from our knowledge base.`;
  }

  enhanceResponseWithMetadata(
    filteredResponse: FilteredResponse,
    sources: Array<{ filename: string; score: number; category: string }>
  ): string {
    let enhancedResponse = filteredResponse.content;
    
    // Add confidence indicator if low
    if (filteredResponse.confidence < 0.8) {
      enhancedResponse = `*Please note: This response has medium confidence (${Math.round(filteredResponse.confidence * 100)}%)*\n\n${enhancedResponse}`;
    }
    
    // Add source quality indicator
    if (sources.length > 0) {
      const avgScore = sources.reduce((sum, s) => sum + s.score, 0) / sources.length;
      if (avgScore < 0.7) {
        enhancedResponse += `\n\n*Note: The source documents have moderate similarity to your query. Consider rephrasing your question for better results.*`;
      }
    }
    
    return enhancedResponse;
  }
}

export const responseFilteringService = new ResponseFilteringService();
export default ResponseFilteringService;

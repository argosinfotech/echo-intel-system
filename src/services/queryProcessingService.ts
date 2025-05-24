
interface QueryAnalysis {
  intent: string;
  keywords: string[];
  entities: string[];
  questionType: 'factual' | 'procedural' | 'conceptual' | 'comparative' | 'general';
  processedQuery: string;
}

class QueryProcessingService {
  
  analyzeQuery(query: string): QueryAnalysis {
    console.log('Analyzing query:', query);
    
    const processedQuery = this.preprocessQuery(query);
    const keywords = this.extractKeywords(processedQuery);
    const entities = this.extractEntities(processedQuery);
    const questionType = this.determineQuestionType(query);
    const intent = this.extractIntent(query, questionType);
    
    return {
      intent,
      keywords,
      entities,
      questionType,
      processedQuery
    };
  }

  private preprocessQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/[?!.,;:]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  private extractKeywords(query: string): string[] {
    // Remove common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'what', 'where', 'when', 'why', 'how'
    ]);
    
    return query
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 10); // Limit to top 10 keywords
  }

  private extractEntities(query: string): string[] {
    // Simple entity extraction - in production, use NLP libraries
    const entities: string[] = [];
    
    // Look for capitalized words (potential proper nouns)
    const words = query.split(' ');
    words.forEach(word => {
      if (word.length > 1 && word[0] === word[0].toUpperCase()) {
        entities.push(word);
      }
    });
    
    return entities;
  }

  private determineQuestionType(query: string): QueryAnalysis['questionType'] {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('how to') || lowerQuery.includes('step') || lowerQuery.includes('process')) {
      return 'procedural';
    } else if (lowerQuery.includes('what is') || lowerQuery.includes('define') || lowerQuery.includes('explain')) {
      return 'conceptual';
    } else if (lowerQuery.includes('compare') || lowerQuery.includes('difference') || lowerQuery.includes('vs')) {
      return 'comparative';
    } else if (lowerQuery.startsWith('what') || lowerQuery.startsWith('when') || lowerQuery.startsWith('where')) {
      return 'factual';
    }
    
    return 'general';
  }

  private extractIntent(query: string, questionType: QueryAnalysis['questionType']): string {
    const lowerQuery = query.toLowerCase();
    
    switch (questionType) {
      case 'procedural':
        return 'seeking_instructions';
      case 'conceptual':
        return 'seeking_explanation';
      case 'comparative':
        return 'seeking_comparison';
      case 'factual':
        return 'seeking_facts';
      default:
        if (lowerQuery.includes('help') || lowerQuery.includes('support')) {
          return 'seeking_help';
        } else if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) {
          return 'seeking_recommendation';
        }
        return 'general_inquiry';
    }
  }

  buildSearchQuery(analysis: QueryAnalysis): string {
    // Combine keywords and entities for better search
    const searchTerms = [...analysis.keywords, ...analysis.entities];
    return searchTerms.join(' ');
  }
}

export const queryProcessingService = new QueryProcessingService();
export default QueryProcessingService;

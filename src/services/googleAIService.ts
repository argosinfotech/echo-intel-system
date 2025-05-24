
interface GoogleAIEmbeddingResponse {
  embedding: {
    values: number[];
  };
}

class GoogleAIService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'Google AI API key is required. Please set VITE_GOOGLE_AI_API_KEY in your environment variables. ' +
        'You can get your API key from https://makersuite.google.com/app/apikey'
      );
    }
    
    this.apiKey = apiKey;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      console.log('Generating embedding with Google AI for text:', text.substring(0, 100) + '...');
      
      const response = await fetch(
        `${this.baseUrl}/models/embedding-001:embedContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'models/embedding-001',
            content: {
              parts: [{ text }]
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
      }

      const data: GoogleAIEmbeddingResponse = await response.json();
      return data.embedding.values;
      
    } catch (error) {
      console.error('Error generating embedding with Google AI:', error);
      // Fallback to mock embeddings if API fails
      console.log('Falling back to mock embeddings');
      return Array.from({ length: 768 }, () => Math.random() - 0.5);
    }
  }

  async generateResponse(query: string, context: string): Promise<string> {
    try {
      console.log('Generating AI response with Google AI');
      
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Context: ${context}\n\nUser Query: ${query}\n\nPlease provide a helpful and accurate response based on the context provided. If the context doesn't contain relevant information, please say so.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 1,
              topP: 1,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      
    } catch (error) {
      console.error('Error generating response with Google AI:', error);
      return 'I apologize, but I encountered an error while generating a response. Please try again.';
    }
  }
}

export const googleAIService = new GoogleAIService();
export default GoogleAIService;

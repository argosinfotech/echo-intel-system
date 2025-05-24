import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen, Database, Search, Brain, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePinecone } from '@/hooks/usePinecone';
import { queryProcessingService } from '@/services/queryProcessingService';
import { googleAIService } from '@/services/googleAIService';
import { responseFilteringService } from '@/services/responseFilteringService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: Array<{
    filename: string;
    category: string;
    score: number;
  }>;
}

const KnowledgeBaseChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI-powered knowledge base assistant. I can search through your documents using advanced vector similarity to find the most relevant information. Ask me anything!',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { searchDocuments, isSearching } = usePinecone();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (query: string, searchResults: any[]): Promise<string> => {
    if (searchResults.length === 0) {
      return `I couldn't find any relevant documents for "${query}". You might want to try rephrasing your question or check if the relevant documents have been uploaded to the knowledge base.`;
    }

    // Use Google AI to generate a contextual response
    const context = searchResults
      .slice(0, 3)
      .map(result => result.text)
      .join('\n\n');

    try {
      const aiResponse = await googleAIService.generateResponse(query, context);
      
      // Filter the response for appropriateness and relevance
      const filteredResponse = responseFilteringService.filterResponse(
        aiResponse, 
        query, 
        searchResults.map(r => r.text)
      );

      // Enhance with metadata if needed
      const sources = searchResults.slice(0, 3).map(result => ({
        filename: result.filename,
        score: result.score,
        category: result.category
      }));

      return responseFilteringService.enhanceResponseWithMetadata(filteredResponse, sources);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      return `Based on the relevant documents I found, here's what I can tell you about "${query}":

${searchResults[0].text.substring(0, 300)}...

This information comes from ${searchResults.length} relevant document${searchResults.length > 1 ? 's' : ''} in our knowledge base.`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Analyze the query for better search
      const queryAnalysis = queryProcessingService.analyzeQuery(query);
      console.log('Query analysis:', queryAnalysis);
      
      // Build enhanced search query
      const searchQuery = queryProcessingService.buildSearchQuery(queryAnalysis);
      
      // Search in Pinecone vector database
      const searchResults = await searchDocuments(searchQuery, 5);
      
      // Generate AI response based on search results
      const aiResponse = await generateAIResponse(query, searchResults.matches);
      
      // Create sources from search results
      const sources = searchResults.matches.slice(0, 3).map(match => ({
        filename: match.filename,
        category: match.category,
        score: match.score,
      }));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined,
      };

      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error while searching the knowledge base. Please try again or contact support if the problem persists.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Knowledge Base Assistant</h1>
          <p className="text-gray-600 flex items-center justify-center space-x-2">
            <Database className="w-4 h-4 text-purple-500" />
            <span>Powered by Pinecone vector search</span>
            <Brain className="w-4 h-4 text-green-500" />
            <span>Google AI (Gemini)</span>
            <Filter className="w-4 h-4 text-blue-500" />
            <span>Smart filtering</span>
          </p>
        </div>

        <Card className="h-[600px] flex flex-col shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Enhanced Semantic Search Chat</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Vector DB + AI
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4 p-6">
            <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div
                      className={`flex items-start space-x-3 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="ml-11 space-y-2">
                        <p className="text-xs font-medium text-gray-600">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, index) => (
                            <div
                              key={index}
                              className="bg-white border rounded-lg px-3 py-2 text-xs"
                            >
                              <div className="flex items-center space-x-2">
                                <Database className="w-3 h-3 text-purple-500" />
                                <span className="font-medium truncate max-w-32">
                                  {source.filename}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {(source.score * 100).toFixed(0)}%
                                </Badge>
                              </div>
                              <p className="text-gray-500 mt-1">{source.category}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {(isTyping || isSearching) && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {isSearching ? 'Searching vector database...' : 'Thinking...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex space-x-2 pt-4 border-t">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your knowledge base..."
                className="flex-1"
                disabled={isTyping || isSearching}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isTyping || isSearching}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeBaseChat;

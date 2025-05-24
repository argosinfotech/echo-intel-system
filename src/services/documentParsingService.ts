interface ParsedDocument {
  text: string;
  metadata: {
    filename: string;
    fileType: string;
    size: number;
    pageCount?: number;
  };
}

class DocumentParsingService {
  
  async parseDocument(file: File): Promise<ParsedDocument> {
    console.log(`Parsing document: ${file.name} (${file.type})`);
    
    const fileType = this.getFileType(file);
    let text: string;
    
    switch (fileType) {
      case 'text':
        text = await this.parseTextFile(file);
        break;
      case 'pdf':
        text = await this.parsePDFFile(file);
        break;
      case 'docx':
        text = await this.parseDocxFile(file);
        break;
      case 'markdown':
        text = await this.parseMarkdownFile(file);
        break;
      default:
        throw new Error(`Unsupported file type: ${file.type}`);
    }

    return {
      text,
      metadata: {
        filename: file.name,
        fileType,
        size: file.size,
      }
    };
  }

  private getFileType(file: File): string {
    const extension = file.name.toLowerCase().split('.').pop() || '';
    const mimeType = file.type.toLowerCase();

    if (mimeType === 'text/plain' || extension === 'txt') {
      return 'text';
    } else if (mimeType === 'application/pdf' || extension === 'pdf') {
      return 'pdf';
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension === 'docx') {
      return 'docx';
    } else if (mimeType === 'text/markdown' || extension === 'md') {
      return 'markdown';
    }
    
    return 'unknown';
  }

  private async parseTextFile(file: File): Promise<string> {
    return await file.text();
  }

  private async parseMarkdownFile(file: File): Promise<string> {
    const content = await file.text();
    // Remove markdown formatting for better indexing
    return content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .trim();
  }

  private async parsePDFFile(file: File): Promise<string> {
    // In a real implementation, you would use a library like pdf-parse or PDF.js
    // For now, we'll return a placeholder
    console.log('PDF parsing would require additional library integration');
    return `[PDF Content] This is extracted text from ${file.name}. In a production environment, this would contain the actual extracted text from the PDF using libraries like PDF.js or pdf-parse. The content would include all readable text from the document pages.`;
  }

  private async parseDocxFile(file: File): Promise<string> {
    // In a real implementation, you would use a library like mammoth.js
    // For now, we'll return a placeholder
    console.log('DOCX parsing would require additional library integration');
    return `[DOCX Content] This is extracted text from ${file.name}. In a production environment, this would contain the actual extracted text from the DOCX document using libraries like mammoth.js. The content would include all text content from the document.`;
  }

  // Enhanced text chunking with better overlap strategy
  chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    let currentSize = 0;
    
    for (const sentence of sentences) {
      const sentenceWithPunct = sentence.trim() + '.';
      
      if (currentSize + sentenceWithPunct.length > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        
        // Create overlap by keeping the last few sentences
        const overlapSentences = currentChunk.split(/[.!?]+/).slice(-2);
        currentChunk = overlapSentences.join('.') + '. ' + sentenceWithPunct;
        currentSize = currentChunk.length;
      } else {
        currentChunk += ' ' + sentenceWithPunct;
        currentSize = currentChunk.length;
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks.filter(chunk => chunk.length > 50); // Filter out very small chunks
  }
}

export const documentParsingService = new DocumentParsingService();
export default DocumentParsingService;

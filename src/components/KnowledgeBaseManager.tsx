import React, { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePinecone } from '@/hooks/usePinecone';
import { documentParsingService } from '@/services/documentParsingService';
import VectorStatsCard from '@/components/VectorStatsCard';
import DocumentUpload from '@/components/DocumentUpload';
import CategorySidebar from '@/components/CategorySidebar';
import DocumentsTable from '@/components/DocumentsTable';
import DocumentActionDialog from '@/components/DocumentActionDialog';
import SearchFilters from '@/components/SearchFilters';
import { UploadFile, Document, Category, ActionType } from '@/types/documents';

const KnowledgeBaseManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [vectorStats, setVectorStats] = useState({ totalVectors: 0, dimension: 1536, indexFullness: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { storeDocument, deleteDocument, getIndexStats, isProcessing } = usePinecone();

  const categories: Category[] = [
    { id: 'all', name: 'All Categories', count: 1234 },
    { id: 'support', name: 'Customer Support', count: 456 },
    { id: 'product', name: 'Product Documentation', count: 321 },
    { id: 'training', name: 'Training Materials', count: 234 },
    { id: 'policies', name: 'Company Policies', count: 123 },
    { id: 'technical', name: 'Technical Guides', count: 100 },
  ];

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'Customer Service Guidelines.pdf',
      category: 'Customer Support',
      size: '2.4 MB',
      uploadDate: '2024-05-20',
      uploadedBy: 'Admin User',
      status: 'processed',
      chunks: 45,
      downloads: 127,
      embeddings: 45
    },
    {
      id: 2,
      name: 'Product Feature Documentation.docx',
      category: 'Product Documentation',
      size: '1.8 MB',
      uploadDate: '2024-05-19',
      uploadedBy: 'Product Manager',
      status: 'processing',
      chunks: 32,
      downloads: 89,
      embeddings: 0
    },
    {
      id: 3,
      name: 'Employee Handbook 2024.pdf',
      category: 'Company Policies',
      size: '5.2 MB',
      uploadDate: '2024-05-18',
      uploadedBy: 'HR Admin',
      status: 'processed',
      chunks: 78,
      downloads: 234,
      embeddings: 78
    },
    {
      id: 4,
      name: 'API Integration Guide.md',
      category: 'Technical Guides',
      size: '892 KB',
      uploadDate: '2024-05-17',
      uploadedBy: 'Tech Lead',
      status: 'processed',
      chunks: 23,
      downloads: 156,
      embeddings: 23
    },
    {
      id: 5,
      name: 'Training Module 1.txt',
      category: 'Training Materials',
      size: '1.1 MB',
      uploadDate: '2024-05-16',
      uploadedBy: 'Training Coordinator',
      status: 'failed',
      chunks: 0,
      downloads: 0,
      embeddings: 0
    }
  ]);

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown'
    ];
    
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.md'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type) && !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      return 'File type not supported. Please upload PDF, DOC, DOCX, TXT, or MD files.';
    }

    if (file.size > maxSize) {
      return 'File size too large. Maximum size is 50MB.';
    }

    return null;
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      const parsedDocument = await documentParsingService.parseDocument(file);
      console.log('Document parsed successfully:', parsedDocument.metadata);
      return parsedDocument.text;
    } catch (error) {
      console.error('Error parsing document:', error);
      // Fallback to simple text extraction
      if (file.type === 'text/plain' || file.type === 'text/markdown') {
        return await file.text();
      }
      return `This is extracted text from ${file.name}. Enhanced document parsing failed, using fallback extraction.`;
    }
  };

  const simulateFileUpload = useCallback(async (uploadFile: UploadFile) => {
    try {
      // Upload progress simulation
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress } : f
        ));
      }

      // Processing phase
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'processing' } : f
      ));
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Extract text from file
      const documentText = await extractTextFromFile(uploadFile.file);

      // Embedding phase
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'embedding' } : f
      ));

      // Store in Pinecone
      const result = await storeDocument(
        documentText,
        uploadFile.file.name,
        'General', // Default category
        uploadFile.id
      );

      if (result.success) {
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, status: 'completed' } : f
        ));

        // Update vector stats
        const stats = await getIndexStats();
        setVectorStats(stats);

        toast({
          title: "Upload successful",
          description: `${uploadFile.file.name} has been processed and indexed with ${result.chunksStored} embeddings.`,
        });
      } else {
        throw new Error('Failed to store embeddings');
      }

    } catch (error) {
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'error', 
          error: 'Failed to process and index document' 
        } : f
      ));

      toast({
        title: "Upload failed",
        description: `Failed to upload and index ${uploadFile.file.name}. Please try again.`,
        variant: "destructive",
      });
    }
  }, [storeDocument, getIndexStats, toast]);

  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploadFiles: UploadFile[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Invalid file",
          description: error,
          variant: "destructive",
        });
        return;
      }

      const uploadFile: UploadFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'uploading'
      };

      newUploadFiles.push(uploadFile);
    });

    if (newUploadFiles.length > 0) {
      setUploadFiles(prev => [...prev, ...newUploadFiles]);
      newUploadFiles.forEach(uploadFile => {
        simulateFileUpload(uploadFile);
      });
    }
  }, [toast, simulateFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const clearCompletedUploads = useCallback(() => {
    setUploadFiles(prev => prev.filter(f => f.status !== 'completed'));
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const openActionDialog = (document: Document, action: Exclude<ActionType, null>) => {
    setSelectedDocument(document);
    setActionType(action);
    setNewFileName(document.name);
    setNewCategory(document.category);
    setReplacementFile(null);
  };

  const closeActionDialog = () => {
    setSelectedDocument(null);
    setActionType(null);
    setNewFileName('');
    setNewCategory('');
    setReplacementFile(null);
  };

  const handleDeleteDocument = async () => {
    if (selectedDocument) {
      const success = await deleteDocument(selectedDocument.id.toString());
      
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument.id));
        
        const stats = await getIndexStats();
        setVectorStats(stats);
        
        toast({
          title: "Document deleted",
          description: `${selectedDocument.name} and its embeddings have been removed.`,
        });
      }
      
      closeActionDialog();
    }
  };

  const handleRenameDocument = () => {
    if (selectedDocument && newFileName.trim()) {
      setDocuments(prev => prev.map(doc => 
        doc.id === selectedDocument.id ? { ...doc, name: newFileName.trim() } : doc
      ));
      toast({
        title: "Document renamed",
        description: `Document has been renamed to ${newFileName.trim()}.`,
      });
      closeActionDialog();
    }
  };

  const handleChangeCategory = () => {
    if (selectedDocument && newCategory.trim()) {
      setDocuments(prev => prev.map(doc => 
        doc.id === selectedDocument.id ? { ...doc, category: newCategory } : doc
      ));
      toast({
        title: "Category updated",
        description: `Document category has been changed to ${newCategory}.`,
      });
      closeActionDialog();
    }
  };

  const handleReplaceFile = () => {
    if (selectedDocument && replacementFile) {
      const error = validateFile(replacementFile);
      if (error) {
        toast({
          title: "Invalid file",
          description: error,
          variant: "destructive",
        });
        return;
      }

      setDocuments(prev => prev.map(doc => 
        doc.id === selectedDocument.id ? { 
          ...doc, 
          name: replacementFile.name,
          size: `${(replacementFile.size / 1024 / 1024).toFixed(1)} MB`,
          status: 'processing' as const,
          uploadDate: new Date().toISOString().split('T')[0]
        } : doc
      ));
      
      toast({
        title: "File replaced",
        description: `${selectedDocument.name} has been replaced with ${replacementFile.name}.`,
      });
      closeActionDialog();
    }
  };

  const handleReplaceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReplacementFile(e.target.files[0]);
    }
  };

  // Load vector stats on component mount
  React.useEffect(() => {
    getIndexStats().then(setVectorStats);
  }, [getIndexStats]);

  return (
    <div className="space-y-8">
      <VectorStatsCard vectorStats={vectorStats} />

      <DocumentUpload
        uploadFiles={uploadFiles}
        isDragOver={isDragOver}
        isProcessing={isProcessing}
        onFileSelect={handleFileSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onRemoveUpload={removeUpload}
        onClearCompleted={clearCompletedUploads}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <div className="lg:col-span-3 space-y-6">
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <DocumentsTable
            documents={documents}
            onActionOpen={openActionDialog}
          />
        </div>
      </div>

      <DocumentActionDialog
        selectedDocument={selectedDocument}
        actionType={actionType}
        categories={categories}
        newFileName={newFileName}
        newCategory={newCategory}
        replacementFile={replacementFile}
        onClose={closeActionDialog}
        onFileNameChange={setNewFileName}
        onCategoryChange={setNewCategory}
        onReplacementFileSelect={handleReplaceFileSelect}
        onDelete={handleDeleteDocument}
        onRename={handleRenameDocument}
        onReplace={handleReplaceFile}
        onChangeCategory={handleChangeCategory}
      />
    </div>
  );
};

export default KnowledgeBaseManager;

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Upload, 
  FileText, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  FolderPlus,
  Calendar,
  User,
  File,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pen,
  RefreshCw,
  Folder,
  Database,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { usePinecone } from '@/hooks/usePinecone';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'embedding' | 'completed' | 'error';
  error?: string;
}

interface Document {
  id: number;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  status: 'processed' | 'processing' | 'failed';
  chunks: number;
  downloads: number;
  embeddings?: number;
}

const KnowledgeBaseManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'rename' | 'replace' | 'category' | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [vectorStats, setVectorStats] = useState({ totalVectors: 0, dimension: 1536, indexFullness: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { storeDocument, deleteDocument, getIndexStats, isProcessing } = usePinecone();

  const categories = [
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
    // This is a mock implementation - in production, you'd use libraries like:
    // - PDF.js for PDFs
    // - mammoth.js for Word documents
    // - Direct reading for text files
    
    if (file.type === 'text/plain' || file.type === 'text/markdown') {
      return await file.text();
    }
    
    // For other file types, return mock text
    return `This is extracted text from ${file.name}. In a real implementation, you would use appropriate libraries to extract text from PDF, DOC, and other file formats. The content would include all the actual text from the document that can be processed and indexed in the vector database.`;
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

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  }, [handleFileSelect]);

  const clearCompletedUploads = useCallback(() => {
    setUploadFiles(prev => prev.filter(f => f.status !== 'completed'));
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const openActionDialog = (document: Document, action: 'delete' | 'rename' | 'replace' | 'category') => {
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
      // Delete from vector database
      const success = await deleteDocument(selectedDocument.id.toString());
      
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument.id));
        
        // Update vector stats
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUploadStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'embedding': return <Database className="w-4 h-4 text-purple-500" />;
      case 'processing': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default: return <Upload className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUploadStatusText = (uploadFile: UploadFile) => {
    switch (uploadFile.status) {
      case 'uploading': return `${uploadFile.progress}%`;
      case 'processing': return 'Processing...';
      case 'embedding': return 'Creating embeddings...';
      case 'completed': return 'Completed';
      case 'error': return uploadFile.error || 'Error';
      default: return '';
    }
  };

  // Load vector stats on component mount
  React.useEffect(() => {
    getIndexStats().then(setVectorStats);
  }, [getIndexStats]);

  return (
    <div className="space-y-8">
      {/* Vector Database Stats */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Database className="w-5 h-5 mr-2 text-purple-500" />
            Vector Database (Pinecone)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{vectorStats.totalVectors.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Total Embeddings</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{vectorStats.dimension}</div>
              <div className="text-sm text-slate-600">Vector Dimension</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{(vectorStats.indexFullness * 100).toFixed(1)}%</div>
              <div className="text-sm text-slate-600">Index Fullness</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-slate-800">
              <Upload className="w-5 h-5 mr-2 text-blue-500" />
              Document Upload & Embedding
            </CardTitle>
            {uploadFiles.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearCompletedUploads}
              >
                Clear Completed
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
              isDragOver 
                ? "border-blue-500 bg-blue-50/50" 
                : "border-blue-300 bg-blue-50/30"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Upload className="w-12 h-12 text-blue-500" />
              <Zap className="w-8 h-8 text-purple-500" />
              <Database className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload & Vectorize Documents</h3>
            <p className="text-slate-600 mb-4">Files are automatically processed and indexed in Pinecone vector database</p>
            <p className="text-sm text-slate-500 mb-4">Supports PDF, DOC, DOCX, TXT, MD files up to 50MB</p>
            
            <div className="space-x-4">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Select Files'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                Bulk Upload
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {uploadFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Upload & Embedding Progress</h4>
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center space-x-3 p-3 bg-white/80 rounded-lg border">
                  {getUploadStatusIcon(uploadFile.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {uploadFile.file.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {uploadFile.status === 'uploading' && (
                        <Progress value={uploadFile.progress} className="h-2 flex-1" />
                      )}
                      <span className="text-xs text-slate-500">
                        {getUploadStatusText(uploadFile)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeUpload(uploadFile.id)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories and Documents List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-800">
              <span>Categories</span>
              <Button size="sm" variant="outline">
                <FolderPlus className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200",
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-100/80 text-slate-700"
                  )}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  <Badge variant="secondary" className={cn(
                    "text-xs",
                    selectedCategory === category.id ? "bg-white/20 text-white" : ""
                  )}>
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80"
                  />
                </div>
                <Button variant="outline" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Embeddings</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{doc.name}</p>
                            <p className="text-sm text-slate-500">{doc.chunks} chunks • {doc.downloads} downloads</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{doc.size}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Database className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-purple-600">
                            {doc.embeddings || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {doc.uploadDate}
                          </div>
                          <div className="flex items-center mt-1">
                            <User className="w-4 h-4 mr-1" />
                            {doc.uploadedBy}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openActionDialog(doc, 'rename')}
                          >
                            <Pen className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openActionDialog(doc, 'replace')}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openActionDialog(doc, 'category')}
                          >
                            <Folder className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openActionDialog(doc, 'delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Dialogs */}
      <Dialog open={actionType !== null} onOpenChange={closeActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'delete' && 'Delete Document'}
              {actionType === 'rename' && 'Rename Document'}
              {actionType === 'replace' && 'Replace Document'}
              {actionType === 'category' && 'Change Category'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'delete' && `Are you sure you want to delete "${selectedDocument?.name}"? This will also remove all associated embeddings from the vector database. This action cannot be undone.`}
              {actionType === 'rename' && `Enter a new name for "${selectedDocument?.name}".`}
              {actionType === 'replace' && `Select a new file to replace "${selectedDocument?.name}". This will update the embeddings in the vector database.`}
              {actionType === 'category' && `Select a new category for "${selectedDocument?.name}".`}
            </DialogDescription>
          </DialogHeader>
          
          {actionType === 'rename' && (
            <div className="py-4">
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Enter new file name"
              />
            </div>
          )}

          {actionType === 'replace' && (
            <div className="py-4">
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => replaceFileInputRef.current?.click()}
                  className="w-full"
                >
                  {replacementFile ? replacementFile.name : 'Select Replacement File'}
                </Button>
                <input
                  ref={replaceFileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.md"
                  onChange={handleReplaceFileSelect}
                  className="hidden"
                />
                {replacementFile && (
                  <p className="text-sm text-slate-600">
                    Size: {(replacementFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>
            </div>
          )}

          {actionType === 'category' && (
            <div className="py-4">
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeActionDialog}>
              Cancel
            </Button>
            {actionType === 'delete' && (
              <Button variant="destructive" onClick={handleDeleteDocument}>
                Delete
              </Button>
            )}
            {actionType === 'rename' && (
              <Button onClick={handleRenameDocument} disabled={!newFileName.trim()}>
                Rename
              </Button>
            )}
            {actionType === 'replace' && (
              <Button onClick={handleReplaceFile} disabled={!replacementFile}>
                Replace
              </Button>
            )}
            {actionType === 'category' && (
              <Button onClick={handleChangeCategory}>
                Update Category
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeBaseManager;

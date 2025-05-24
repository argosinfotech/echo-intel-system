import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

const KnowledgeBaseManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'All Categories', count: 1234 },
    { id: 'support', name: 'Customer Support', count: 456 },
    { id: 'product', name: 'Product Documentation', count: 321 },
    { id: 'training', name: 'Training Materials', count: 234 },
    { id: 'policies', name: 'Company Policies', count: 123 },
    { id: 'technical', name: 'Technical Guides', count: 100 },
  ];

  const documents = [
    {
      id: 1,
      name: 'Customer Service Guidelines.pdf',
      category: 'Customer Support',
      size: '2.4 MB',
      uploadDate: '2024-05-20',
      uploadedBy: 'Admin User',
      status: 'processed',
      chunks: 45,
      downloads: 127
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
      downloads: 89
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
      downloads: 234
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
      downloads: 156
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
      downloads: 0
    }
  ];

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

  const simulateFileUpload = useCallback(async (uploadFile: UploadFile) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress } : f
        ));
      }

      // Simulate processing
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'processing' } : f
      ));

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Complete
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'completed' } : f
      ));

      toast({
        title: "Upload successful",
        description: `${uploadFile.file.name} has been processed and added to the knowledge base.`,
      });

    } catch (error) {
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'error', 
          error: 'Upload failed. Please try again.' 
        } : f
      ));

      toast({
        title: "Upload failed",
        description: `Failed to upload ${uploadFile.file.name}. Please try again.`,
        variant: "destructive",
      });
    }
  }, [toast]);

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
      case 'processing': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default: return <Upload className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-slate-800">
              <Upload className="w-5 h-5 mr-2 text-blue-500" />
              Document Upload
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
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload Knowledge Base Documents</h3>
            <p className="text-slate-600 mb-4">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-slate-500 mb-4">Supports PDF, DOC, DOCX, TXT, MD files up to 50MB</p>
            
            <div className="space-x-4">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Select Files
              </Button>
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
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
              <h4 className="text-sm font-medium text-slate-700">Upload Progress</h4>
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
                        {uploadFile.status === 'uploading' && `${uploadFile.progress}%`}
                        {uploadFile.status === 'processing' && 'Processing...'}
                        {uploadFile.status === 'completed' && 'Completed'}
                        {uploadFile.status === 'error' && uploadFile.error}
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

      {/* Categories and Search */}
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

          {/* Documents Grid */}
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-800 truncate">{doc.name}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                          <span className="flex items-center">
                            <Badge variant="outline">{doc.category}</Badge>
                          </span>
                          <span className="flex items-center">
                            <File className="w-4 h-4 mr-1" />
                            {doc.size}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {doc.uploadDate}
                          </span>
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {doc.uploadedBy}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-3">
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {doc.chunks} chunks • {doc.downloads} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button size="sm" className="bg-blue-500 text-white">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseManager;

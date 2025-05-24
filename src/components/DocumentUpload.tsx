
import React, { useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, XCircle, CheckCircle, AlertCircle, Database, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadFile } from '@/types/documents';

interface DocumentUploadProps {
  uploadFiles: UploadFile[];
  isDragOver: boolean;
  isProcessing: boolean;
  onFileSelect: (files: FileList | File[]) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveUpload: (id: string) => void;
  onClearCompleted: () => void;
}

const DocumentUpload = ({
  uploadFiles,
  isDragOver,
  isProcessing,
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveUpload,
  onClearCompleted,
}: DocumentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  }, [onFileSelect]);

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

  return (
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
              onClick={onClearCompleted}
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
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
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
                  onClick={() => onRemoveUpload(uploadFile.id)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;

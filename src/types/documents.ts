
export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'embedding' | 'completed' | 'error';
  error?: string;
}

export interface Document {
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

export interface Category {
  id: string;
  name: string;
  count: number;
}

export type ActionType = 'delete' | 'rename' | 'replace' | 'category' | null;

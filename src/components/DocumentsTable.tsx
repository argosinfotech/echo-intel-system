
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  Eye,
  Download,
  Trash2,
  Pen,
  RefreshCw,
  Folder,
  Calendar,
  User,
  Database,
} from 'lucide-react';
import { Document, ActionType } from '@/types/documents';

interface DocumentsTableProps {
  documents: Document[];
  onActionOpen: (document: Document, action: Exclude<ActionType, null>) => void;
}

const DocumentsTable = ({ documents, onActionOpen }: DocumentsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
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
                      onClick={() => onActionOpen(doc, 'rename')}
                    >
                      <Pen className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onActionOpen(doc, 'replace')}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onActionOpen(doc, 'category')}
                    >
                      <Folder className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onActionOpen(doc, 'delete')}
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
  );
};

export default DocumentsTable;

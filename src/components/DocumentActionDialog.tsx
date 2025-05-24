
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Document, ActionType, Category } from '@/types/documents';

interface DocumentActionDialogProps {
  selectedDocument: Document | null;
  actionType: ActionType;
  categories: Category[];
  newFileName: string;
  newCategory: string;
  replacementFile: File | null;
  onClose: () => void;
  onFileNameChange: (name: string) => void;
  onCategoryChange: (category: string) => void;
  onReplacementFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onRename: () => void;
  onReplace: () => void;
  onChangeCategory: () => void;
}

const DocumentActionDialog = ({
  selectedDocument,
  actionType,
  categories,
  newFileName,
  newCategory,
  replacementFile,
  onClose,
  onFileNameChange,
  onCategoryChange,
  onReplacementFileSelect,
  onDelete,
  onRename,
  onReplace,
  onChangeCategory,
}: DocumentActionDialogProps) => {
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={actionType !== null} onOpenChange={onClose}>
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
              onChange={(e) => onFileNameChange(e.target.value)}
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
                onChange={onReplacementFileSelect}
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
            <Select value={newCategory} onValueChange={onCategoryChange}>
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {actionType === 'delete' && (
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
          {actionType === 'rename' && (
            <Button onClick={onRename} disabled={!newFileName.trim()}>
              Rename
            </Button>
          )}
          {actionType === 'replace' && (
            <Button onClick={onReplace} disabled={!replacementFile}>
              Replace
            </Button>
          )}
          {actionType === 'category' && (
            <Button onClick={onChangeCategory}>
              Update Category
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentActionDialog;

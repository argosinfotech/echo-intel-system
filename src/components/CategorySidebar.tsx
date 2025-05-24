
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/types/documents';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySidebar = ({ categories, selectedCategory, onCategorySelect }: CategorySidebarProps) => {
  return (
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
              onClick={() => onCategorySelect(category.id)}
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
  );
};

export default CategorySidebar;

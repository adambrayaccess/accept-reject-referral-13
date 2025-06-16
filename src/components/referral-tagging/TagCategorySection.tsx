
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface TagCategorySectionProps {
  categoryName: string;
  tags: string[];
  currentTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  isUpdating: boolean;
}

const TagCategorySection = ({ 
  categoryName, 
  tags, 
  currentTags, 
  onAddTag, 
  onRemoveTag, 
  isUpdating 
}: TagCategorySectionProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium capitalize">{categoryName}</h4>
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <Badge
            key={tag}
            variant={currentTags.includes(tag) ? "default" : "outline"}
            className={`cursor-pointer hover:bg-secondary text-xs ${isUpdating ? 'opacity-50' : ''}`}
            onClick={() => !isUpdating && (currentTags.includes(tag) ? onRemoveTag(tag) : onAddTag(tag))}
          >
            {tag}
            {currentTags.includes(tag) ? (
              <X className="h-3 w-3 ml-1" />
            ) : (
              <Plus className="h-3 w-3 ml-1" />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagCategorySection;

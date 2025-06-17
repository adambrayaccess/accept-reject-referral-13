
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { getTagStyle, getTagCategoryInfo, TagCategory } from '@/utils/tagCategoryUtils';

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
  const categoryInfo = getTagCategoryInfo(categoryName as TagCategory);

  return (
    <div className="space-y-2">
      <h4 className={`text-sm font-medium capitalize ${categoryInfo.color}`}>{categoryName}</h4>
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <Badge
            key={tag}
            variant="outline"
            className={`cursor-pointer hover:opacity-80 text-xs ${isUpdating ? 'opacity-50' : ''} ${
              currentTags.includes(tag) ? getTagStyle(tag) : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
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

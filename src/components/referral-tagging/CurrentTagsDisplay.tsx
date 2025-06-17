
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { getTagStyle } from '@/utils/tagCategoryUtils';

interface CurrentTagsDisplayProps {
  tags: string[];
  onRemoveTag: (tag: string) => void;
  isUpdating: boolean;
}

const CurrentTagsDisplay = ({ tags, onRemoveTag, isUpdating }: CurrentTagsDisplayProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Current Tags</h4>
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <Badge key={tag} variant="outline" className={`text-xs ${getTagStyle(tag)}`}>
            {tag}
            <X 
              className={`h-3 w-3 ml-1 cursor-pointer hover:text-red-500 ${isUpdating ? 'opacity-50' : ''}`}
              onClick={() => !isUpdating && onRemoveTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <Separator />
    </div>
  );
};

export default CurrentTagsDisplay;

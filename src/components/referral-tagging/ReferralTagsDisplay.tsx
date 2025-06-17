
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { getTagStyle } from '@/utils/tagCategoryUtils';

interface ReferralTagsDisplayProps {
  tags: string[];
  maxVisible?: number;
  size?: 'sm' | 'default';
}

const ReferralTagsDisplay = ({ tags, maxVisible = 3, size = 'default' }: ReferralTagsDisplayProps) => {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <Tag className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
      {visibleTags.map(tag => (
        <Badge 
          key={tag} 
          variant="outline" 
          className={`${size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs'} ${getTagStyle(tag)}`}
        >
          {tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge 
          variant="outline" 
          className={`${size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs'} text-gray-800 bg-gray-100 border-gray-200`}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
};

export default ReferralTagsDisplay;

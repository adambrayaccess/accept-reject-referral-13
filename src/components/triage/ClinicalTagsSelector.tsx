import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, X } from 'lucide-react';
import { CLINICAL_TAG_CATEGORIES } from '@/components/referral-tagging/constants/tagCategories';
import { getTagStyle } from '@/utils/tagCategoryUtils';

interface ClinicalTagsSelectorProps {
  currentTags: string[];
  onTagsChange: (tags: string[]) => void;
  isUpdating?: boolean;
}

const ClinicalTagsSelector = ({ 
  currentTags, 
  onTagsChange, 
  isUpdating = false 
}: ClinicalTagsSelectorProps) => {
  const [customTag, setCustomTag] = useState('');

  const handleAddTag = (tag: string) => {
    if (!currentTags.includes(tag)) {
      onTagsChange([...currentTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(currentTags.filter(t => t !== tag));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !currentTags.includes(customTag.trim())) {
      onTagsChange([...currentTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  // Get all predefined tags from categories
  const allPredefinedTags = Object.values(CLINICAL_TAG_CATEGORIES).flat();

  return (
    <div className="space-y-4 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-medium">Clinical Tags</h4>
      </div>

      {/* Display current tags */}
      {currentTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Applied tags:</div>
          <div className="flex flex-wrap gap-2">
            {currentTags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className={`${getTagStyle(tag)} flex items-center gap-1`}
              >
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={isUpdating}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Quick add predefined tags */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">Quick add:</div>
        <div className="flex flex-wrap gap-2">
          {allPredefinedTags
            .filter(tag => !currentTags.includes(tag))
            .slice(0, 8) // Show only first 8 to avoid clutter
            .map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className={`cursor-pointer hover:opacity-80 ${getTagStyle(tag)} flex items-center gap-1`}
                onClick={() => handleAddTag(tag)}
              >
                {tag}
                <Plus className="h-3 w-3" />
              </Badge>
            ))}
        </div>
      </div>

      {/* Custom tag input */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">Add custom tag:</div>
        <div className="flex gap-2">
          <Input
            placeholder="Enter tag name"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            className="text-sm"
          />
          <Button 
            type="button"
            onClick={handleAddCustomTag} 
            disabled={!customTag.trim() || isUpdating}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalTagsSelector;
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tag, Plus } from 'lucide-react';
import { Referral } from '@/types/referral';
import { CLINICAL_TAG_CATEGORIES } from './constants/tagCategories';
import TagCategorySection from './TagCategorySection';
import CustomTagInput from './CustomTagInput';
import CurrentTagsDisplay from './CurrentTagsDisplay';
import { useToast } from '@/hooks/use-toast';

interface ClinicalTagsPopoverProps {
  referral: Referral;
  onTagsUpdated: () => void;
}

const ClinicalTagsPopover = ({ referral, onTagsUpdated }: ClinicalTagsPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const currentTags = referral.tags || [];

  const handleAddTag = async (tag: string) => {
    if (currentTags.includes(tag)) return;
    
    setIsUpdating(true);
    try {
      // Simulate API call - in real app this would update the database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Tag Added",
        description: `Added "${tag}" to referral`,
      });
      
      onTagsUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    setIsUpdating(true);
    try {
      // Simulate API call - in real app this would update the database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Tag Removed",
        description: `Removed "${tag}" from referral`,
      });
      
      onTagsUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Tag className="h-4 w-4" />
          Clinical Tags
          {currentTags.length > 0 && (
            <span className="ml-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {currentTags.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <h3 className="font-semibold">Clinical Tags</h3>
          </div>
          
          <CurrentTagsDisplay 
            tags={currentTags}
            onRemoveTag={handleRemoveTag}
            isUpdating={isUpdating}
          />

          {Object.entries(CLINICAL_TAG_CATEGORIES).map(([categoryName, tags]) => (
            <div key={categoryName}>
              <TagCategorySection
                categoryName={categoryName}
                tags={tags}
                currentTags={currentTags}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                isUpdating={isUpdating}
              />
            </div>
          ))}

          <Separator />
          
          <CustomTagInput 
            onAddTag={handleAddTag}
            isUpdating={isUpdating}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ClinicalTagsPopover;
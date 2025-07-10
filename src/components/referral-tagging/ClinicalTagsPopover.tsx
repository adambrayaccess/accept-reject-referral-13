import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tag, Plus, X } from 'lucide-react';
import { Referral } from '@/types/referral';
import { CLINICAL_TAG_CATEGORIES } from './constants/tagCategories';
import TagCategorySection from './TagCategorySection';
import CustomTagInput from './CustomTagInput';
import CurrentTagsDisplay from './CurrentTagsDisplay';
import { useToast } from '@/hooks/use-toast';
import { updateReferralTags } from '@/services/referralService';
interface ClinicalTagsPopoverProps {
  referral: Referral;
  onTagsUpdated: () => void;
}
const ClinicalTagsPopover = ({
  referral,
  onTagsUpdated
}: ClinicalTagsPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    toast
  } = useToast();
  const currentTags = referral.tags || [];
  const handleAddTag = async (tag: string) => {
    if (currentTags.includes(tag)) return;
    setIsUpdating(true);
    try {
      const updatedTags = [...currentTags, tag];
      const success = await updateReferralTags(referral.id, updatedTags);
      if (success) {
        toast({
          title: "Tag Added",
          description: `Added "${tag}" to referral`
        });
        onTagsUpdated();
      } else {
        toast({
          title: "Error",
          description: "Failed to add tag",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  const handleRemoveTag = async (tag: string) => {
    setIsUpdating(true);
    try {
      const updatedTags = currentTags.filter(t => t !== tag);
      const success = await updateReferralTags(referral.id, updatedTags);
      if (success) {
        toast({
          title: "Tag Removed",
          description: `Removed "${tag}" from referral`
        });
        onTagsUpdated();
      } else {
        toast({
          title: "Error",
          description: "Failed to remove tag",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors">
          <Tag className="h-3 w-3" />
          Tags
          {currentTags.length > 0 && <span className="bg-blue-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
              {currentTags.length}
            </span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 bg-white border shadow-lg z-50" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <h3 className="font-semibold">Clinical Tags</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0 hover:bg-muted">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <CurrentTagsDisplay tags={currentTags} onRemoveTag={handleRemoveTag} isUpdating={isUpdating} />

          {Object.entries(CLINICAL_TAG_CATEGORIES).map(([categoryName, tags]) => <div key={categoryName}>
              <TagCategorySection categoryName={categoryName} tags={tags} currentTags={currentTags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} isUpdating={isUpdating} />
            </div>)}

          <Separator />
          
          <CustomTagInput onAddTag={handleAddTag} isUpdating={isUpdating} />
        </div>
      </PopoverContent>
    </Popover>;
};
export default ClinicalTagsPopover;

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Tag, ChevronDown } from 'lucide-react';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';
import { updateReferralTags } from '@/services/referralService';
import { CLINICAL_TAG_CATEGORIES } from './constants/tagCategories';
import CurrentTagsDisplay from './CurrentTagsDisplay';
import CustomTagInput from './CustomTagInput';
import TagCategorySection from './TagCategorySection';

interface ReferralTaggingProps {
  referral: Referral;
  onTagsUpdated: () => void;
}

const ReferralTagging = ({ referral, onTagsUpdated }: ReferralTaggingProps) => {
  const [currentTags, setCurrentTags] = useState<string[]>(referral.tags || []);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const updateTags = async (updatedTags: string[]) => {
    setIsUpdating(true);
    try {
      const success = await updateReferralTags(referral.id, updatedTags);
      if (success) {
        setCurrentTags(updatedTags);
        onTagsUpdated();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update tags',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tags',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddTag = async (tag: string) => {
    if (!currentTags.includes(tag)) {
      const updatedTags = [...currentTags, tag];
      await updateTags(updatedTags);
      
      toast({
        title: 'Tag Added',
        description: `Added "${tag}" to referral`,
      });
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    await updateTags(updatedTags);
    
    toast({
      title: 'Tag Removed',
      description: `Removed "${tagToRemove}" from referral`,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Clinical Tags
                {currentTags.length > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({currentTags.length})
                  </span>
                )}
              </div>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`} 
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <CurrentTagsDisplay
              tags={currentTags}
              onRemoveTag={handleRemoveTag}
              isUpdating={isUpdating}
            />

            <CustomTagInput
              onAddTag={handleAddTag}
              isUpdating={isUpdating}
            />

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Clinical Categories</h4>
              {Object.entries(CLINICAL_TAG_CATEGORIES).map(([categoryName, tags]) => (
                <TagCategorySection
                  key={categoryName}
                  categoryName={categoryName}
                  tags={tags}
                  currentTags={currentTags}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ReferralTagging;

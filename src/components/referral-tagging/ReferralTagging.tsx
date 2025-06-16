import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tag, Plus, X } from 'lucide-react';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';
import { updateReferralTags } from '@/services/referralService';

interface ReferralTaggingProps {
  referral: Referral;
  onTagsUpdated: () => void;
}

const CLINICAL_TAG_CATEGORIES = {
  status: [
    'Follow-up needed',
    'Awaiting test results',
    'Incomplete referral',
    'Requires additional info',
    'Ready for assessment'
  ],
  priority: [
    'Urgent review',
    'Priority case',
    'Routine follow-up',
    'Non-urgent'
  ],
  clinical: [
    'Complex case',
    'Multi-specialty',
    'Second opinion required',
    'Specialist equipment needed',
    'Pre-operative assessment'
  ],
  administrative: [
    'Insurance verification needed',
    'Consent required',
    'Transport arranged',
    'Interpreter required',
    'Special accommodation'
  ]
};

const ReferralTagging = ({ referral, onTagsUpdated }: ReferralTaggingProps) => {
  const [newTag, setNewTag] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>(referral.tags || []);
  const [isUpdating, setIsUpdating] = useState(false);
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

  const handleAddCustomTag = () => {
    if (!newTag.trim()) return;
    
    handleAddTag(newTag.trim());
    setNewTag('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const renderTagCategory = (categoryName: string, tags: string[]) => (
    <div key={categoryName} className="space-y-2">
      <h4 className="text-sm font-medium capitalize">{categoryName}</h4>
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <Badge
            key={tag}
            variant={currentTags.includes(tag) ? "default" : "outline"}
            className={`cursor-pointer hover:bg-secondary text-xs ${isUpdating ? 'opacity-50' : ''}`}
            onClick={() => !isUpdating && (currentTags.includes(tag) ? handleRemoveTag(tag) : handleAddTag(tag))}
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Tag className="h-5 w-5 mr-2" />
          Clinical Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tags Display */}
        {currentTags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Current Tags</h4>
            <div className="flex flex-wrap gap-1">
              {currentTags.map(tag => (
                <Badge key={tag} variant="default" className="text-xs">
                  {tag}
                  <X 
                    className={`h-3 w-3 ml-1 cursor-pointer hover:text-red-500 ${isUpdating ? 'opacity-50' : ''}`}
                    onClick={() => !isUpdating && handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <Separator />
          </div>
        )}

        {/* Custom Tag Input */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Add Custom Tag</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-sm"
              disabled={isUpdating}
            />
            <Button 
              onClick={handleAddCustomTag} 
              disabled={!newTag.trim() || isUpdating} 
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Clinical Tag Categories */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Clinical Categories</h4>
          {Object.entries(CLINICAL_TAG_CATEGORIES).map(([categoryName, tags]) =>
            renderTagCategory(categoryName, tags)
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralTagging;

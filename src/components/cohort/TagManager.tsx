
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TagManagerProps {
  selectedReferrals: Referral[];
  onTagged: () => void;
}

const TagManager = ({ selectedReferrals, onTagged }: TagManagerProps) => {
  const [newTag, setNewTag] = useState('');
  const [commonTags, setCommonTags] = useState([
    'Follow-up needed', 
    'Requires test results', 
    'Incomplete information', 
    'Second opinion', 
    'Special case', 
    'Priority review'
  ]);
  const { toast } = useToast();

  const handleAddTag = (tag: string) => {
    // In a real app, this would call an API to update the referrals
    // For now, we'll simulate adding tags
    
    toast({
      title: 'Tags Applied',
      description: `Applied "${tag}" to ${selectedReferrals.length} referrals`,
    });
    
    // Update local tag state (if this was a real app with a database)
    // For now, we just notify and clear selection
    onTagged();
  };

  const handleAddCustomTag = () => {
    if (!newTag.trim()) return;
    
    handleAddTag(newTag);
    
    // Add to common tags if it's not already there
    if (!commonTags.includes(newTag)) {
      setCommonTags(prev => [...prev, newTag]);
    }
    
    setNewTag('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <h3 className="font-medium">Apply Tags to {selectedReferrals.length} Referrals</h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter a tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddCustomTag} disabled={!newTag.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Common tags:</h4>
            <div className="flex flex-wrap gap-2">
              {commonTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                  <Plus className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TagManager;

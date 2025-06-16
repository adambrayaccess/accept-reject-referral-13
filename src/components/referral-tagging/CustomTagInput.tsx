
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface CustomTagInputProps {
  onAddTag: (tag: string) => void;
  isUpdating: boolean;
}

const CustomTagInput = ({ onAddTag, isUpdating }: CustomTagInputProps) => {
  const [newTag, setNewTag] = useState('');

  const handleAddCustomTag = () => {
    if (!newTag.trim()) return;
    
    onAddTag(newTag.trim());
    setNewTag('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  return (
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
  );
};

export default CustomTagInput;


import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, CheckSquare, Square } from 'lucide-react';
import { Referral } from '@/types/referral';

interface TaggedPatientsSelectionControlsProps {
  taggedReferrals: Referral[];
  selectedReferrals: Referral[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

const TaggedPatientsSelectionControls = ({
  taggedReferrals,
  selectedReferrals,
  onSelectAll,
  onClearSelection,
  isAllSelected,
  isIndeterminate
}: TaggedPatientsSelectionControlsProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            ref={(el) => {
              if (el) {
                el.indeterminate = isIndeterminate;
              }
            }}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectAll();
              } else {
                onClearSelection();
              }
            }}
            id="select-all-tagged"
          />
          <label 
            htmlFor="select-all-tagged" 
            className="text-sm font-medium cursor-pointer"
          >
            Select all
          </label>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {selectedReferrals.length} of {taggedReferrals.length} selected
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          disabled={isAllSelected}
          className="h-8"
        >
          <CheckSquare className="h-3 w-3 mr-1" />
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          disabled={selectedReferrals.length === 0}
          className="h-8"
        >
          <Square className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default TaggedPatientsSelectionControls;

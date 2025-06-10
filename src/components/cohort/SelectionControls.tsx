
import { Button } from '@/components/ui/button';
import { Referral } from '@/types/referral';

interface SelectionControlsProps {
  totalCount: number;
  selectedCount: number;
  onRefresh: () => void;
  onClearSelection: () => void;
  onSelectAll: (referrals: Referral[]) => void;
  referrals: Referral[];
}

const SelectionControls = ({ 
  totalCount, 
  selectedCount, 
  onRefresh, 
  onClearSelection, 
  onSelectAll, 
  referrals 
}: SelectionControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <span className="text-sm font-medium">{totalCount} patients</span>
        {selectedCount > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            ({selectedCount} selected)
          </span>
        )}
      </div>
      
      <div className="space-x-2">
        <Button variant="outline" onClick={onRefresh} className="ml-2">
          Refresh List
        </Button>
        {selectedCount > 0 ? (
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            Clear Selection
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onSelectAll(referrals)}>
            Select All
          </Button>
        )}
      </div>
    </div>
  );
};

export default SelectionControls;

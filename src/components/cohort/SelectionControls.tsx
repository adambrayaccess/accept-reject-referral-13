
import { Button } from '@/components/ui/button';
import { RefreshCw, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  const handleSelectAll = () => {
    onSelectAll(referrals);
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {totalCount} total referrals
          </span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedCount} selected
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4 mr-1" />
            Clear Selection
          </Button>
        )}
        
        {selectedCount === 0 && referrals.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            <Check className="h-4 w-4 mr-1" />
            Select All
          </Button>
        )}
        
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default SelectionControls;

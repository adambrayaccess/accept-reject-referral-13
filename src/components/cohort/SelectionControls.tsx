
import { Button } from '@/components/ui/button';
import { Referral } from '@/types/referral';
import CohortFilters from './CohortFilters';
import SearchTablist from './SearchTablist';

interface SelectionControlsProps {
  totalCount: number;
  selectedCount: number;
  onRefresh: () => void;
  onClearSelection: () => void;
  onSelectAll: (referrals: Referral[]) => void;
  referrals: Referral[];
  filters?: any;
  setFilters?: (filters: any) => void;
}

const SelectionControls = ({ 
  totalCount, 
  selectedCount, 
  onRefresh, 
  onClearSelection, 
  onSelectAll, 
  referrals,
  filters,
  setFilters
}: SelectionControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Search and Action Buttons */}
      <SearchTablist />
      
      {/* Statistics and Controls */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm font-medium">{totalCount} patients</span>
          {selectedCount > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({selectedCount} selected)
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onRefresh}>
            Refresh List
          </Button>
          
          {filters && setFilters && (
            <CohortFilters filters={filters} setFilters={setFilters} />
          )}
          
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
    </div>
  );
};

export default SelectionControls;

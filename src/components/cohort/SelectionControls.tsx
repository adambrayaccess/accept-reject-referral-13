
import { Button } from '@/components/ui/button';
import { Referral } from '@/types/referral';
import CohortFilters from './CohortFilters';
import SearchTablist from './SearchTablist';
import WaitingListAIActions from './WaitingListAIActions';

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
      {/* Search and AI Actions Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Left column - SearchTablist */}
        <div className="w-full lg:flex-1">
          <SearchTablist />
        </div>
        
        {/* Right column - WaitingListAIActions */}
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <WaitingListAIActions />
        </div>
      </div>
      
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

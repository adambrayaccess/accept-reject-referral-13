
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import WaitingListSearchBar from './WaitingListSearchBar';
import WaitingListSortAndFilterControls from './WaitingListSortAndFilterControls';

interface WaitingListControlsProps {
  filters: any;
  updateFilters: (updates: any) => void;
  clearFilters: () => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const WaitingListControls = ({
  filters,
  updateFilters,
  clearFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}: WaitingListControlsProps) => {
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priority !== 'all') count++;
    if (filters.location) count++;
    if (filters.search) count++;
    if (filters.ageRange?.min > 0 || filters.ageRange?.max < 365) count++;
    if (filters.includeDischarged) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="w-full lg:flex-1">
          <WaitingListSearchBar
            searchValue={filters.search || ''}
            onSearchChange={(value) => updateFilters({ search: value })}
          />
        </div>
        
        <div className="flex gap-2 w-full lg:w-auto items-center lg:flex-shrink-0">
          <WaitingListSortAndFilterControls
            filters={filters}
            updateFilters={updateFilters}
            clearFilters={clearFilters}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.priority !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Priority: {filters.priority}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ priority: 'all' })}
              />
            </Badge>
          )}
          
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.location}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ location: '' })}
              />
            </Badge>
          )}
          
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ search: '' })}
              />
            </Badge>
          )}
          
          {(filters.ageRange?.min > 0 || filters.ageRange?.max < 365) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Days: {filters.ageRange?.min || 0}-{filters.ageRange?.max || 365}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ ageRange: { min: 0, max: 365 } })}
              />
            </Badge>
          )}
          
          {filters.includeDischarged && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Include discharged
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ includeDischarged: false })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default WaitingListControls;


import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import WaitingListSortAndFilterControls from './WaitingListSortAndFilterControls';
import WaitingListViewToggle from './WaitingListViewToggle';
import WaitingListFilters from './WaitingListFilters';
import { WaitingListFilters as WaitingListFiltersType } from '@/hooks/waitingList/useWaitingListFilters';

interface WaitingListControlsProps {
  filters: WaitingListFiltersType;
  updateFilters: (filters: Partial<WaitingListFiltersType>) => void;
  clearFilters: () => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  view: 'table' | 'grid';
  onViewChange: (view: 'table' | 'grid') => void;
}

const WaitingListControls = ({
  filters,
  updateFilters,
  clearFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  view,
  onViewChange
}: WaitingListControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by patient name, NHS number, or UBRN..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <WaitingListViewToggle view={view} onViewChange={onViewChange} />
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <WaitingListFilters
            filters={filters}
            updateFilters={updateFilters}
            clearFilters={clearFilters}
          />
        </div>
        
        <div className="lg:w-auto">
          <WaitingListSortAndFilterControls
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
        </div>
      </div>
    </div>
  );
};

export default WaitingListControls;

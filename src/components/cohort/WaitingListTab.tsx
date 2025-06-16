
import SearchBar from '../dashboard/SearchBar';
import FilterBar from '../dashboard/FilterBar';
import AIAssistantActions from '../dashboard/AIAssistantActions';
import WaitingListTable from './WaitingListTable';
import TagManager from './TagManager';
import SelectionControls from './SelectionControls';
import { Referral } from '@/types/referral';

interface WaitingListTabProps {
  referrals: Referral[];
  isLoading: boolean;
  filters: any;
  updateFilters: (filters: any) => void;
  clearFilters: () => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  selectedReferrals: Referral[];
  toggleReferralSelection: (referral: Referral) => void;
  clearSelection: () => void;
  selectAll: (referrals: Referral[]) => void;
  handleRefresh: () => void;
  reorderReferrals: (referrals: Referral[]) => void;
}

const WaitingListTab = ({
  referrals,
  isLoading,
  filters,
  updateFilters,
  clearFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  selectedReferrals,
  toggleReferralSelection,
  clearSelection,
  selectAll,
  handleRefresh,
  reorderReferrals
}: WaitingListTabProps) => {
  return (
    <div className="space-y-6">
      {/* Dashboard-style header with search, filters, and AI actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar
            searchTerm={filters.search || ''}
            setSearchTerm={(value) => updateFilters({ search: value })}
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterBar
            statusFilter={filters.status || 'all'}
            setStatusFilter={(status) => updateFilters({ status })}
            priorityFilter={filters.priority || 'all'}
            setPriorityFilter={(priority) => updateFilters({ priority })}
          />
          <AIAssistantActions />
        </div>
      </div>

      {/* Selection controls */}
      <SelectionControls
        totalCount={referrals.length}
        selectedCount={selectedReferrals.length}
        onRefresh={handleRefresh}
        onClearSelection={clearSelection}
        onSelectAll={selectAll}
        referrals={referrals}
      />

      {/* Tag manager for selected referrals */}
      {selectedReferrals.length > 0 && (
        <TagManager selectedReferrals={selectedReferrals} onTagged={clearSelection} />
      )}
      
      {/* Waiting list table */}
      <WaitingListTable 
        referrals={referrals}
        isLoading={isLoading}
        selectedReferrals={selectedReferrals}
        onSelectReferral={toggleReferralSelection}
        onReorderReferrals={reorderReferrals}
      />
    </div>
  );
};

export default WaitingListTab;

import WaitingListDashboard from './WaitingListDashboard';
import ReferralTrendsChart from './ReferralTrendsChart';
import WaitingListCharts from './WaitingListCharts';
import WaitingListControls from './WaitingListControls';
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
      {/* Business Intelligence Dashboard */}
      <WaitingListDashboard referrals={referrals} />
      
      {/* Referral Trends Chart */}
      <ReferralTrendsChart referrals={referrals} />
      
      {/* Existing Charts */}
      <WaitingListCharts referrals={referrals} />
      
      <SelectionControls
        totalCount={referrals.length}
        selectedCount={selectedReferrals.length}
        onRefresh={handleRefresh}
        onClearSelection={clearSelection}
        onSelectAll={selectAll}
        referrals={referrals}
      />

      <WaitingListControls
        searchTerm={filters.search}
        onSearchChange={(value) => updateFilters({ search: value })}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        priorityFilter={filters.priority}
        onPriorityFilterChange={(priority) => updateFilters({ priority })}
        locationFilter={filters.location}
        onLocationFilterChange={(location) => updateFilters({ location })}
        ageFilter={filters.ageRange}
        onAgeFilterChange={(ageRange) => updateFilters({ ageRange })}
        onClearFilters={clearFilters}
      />
      
      {selectedReferrals.length > 0 && (
        <TagManager selectedReferrals={selectedReferrals} onTagged={clearSelection} />
      )}
      
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

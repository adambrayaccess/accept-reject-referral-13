
import CohortFilters from './CohortFilters';
import WaitingListTable from './WaitingListTable';
import TagManager from './TagManager';
import SelectionControls from './SelectionControls';
import { Referral } from '@/types/referral';

interface CohortBuilderTabProps {
  referrals: Referral[];
  isLoading: boolean;
  filters: any;
  setFilters: (filters: any) => void;
  selectedReferrals: Referral[];
  toggleReferralSelection: (referral: Referral) => void;
  clearSelection: () => void;
  selectAll: (referrals: Referral[]) => void;
  handleRefresh: () => void;
}

const CohortBuilderTab = ({
  referrals,
  isLoading,
  filters,
  setFilters,
  selectedReferrals,
  toggleReferralSelection,
  clearSelection,
  selectAll,
  handleRefresh
}: CohortBuilderTabProps) => {
  const handleReorderReferrals = (reorderedReferrals: Referral[]) => {
    // For now, just log the reordering - in a real app this would update the backend
    console.log('Reordered referrals:', reorderedReferrals.map(r => r.patient.name));
  };

  return (
    <div className="space-y-4">
      <CohortFilters filters={filters} setFilters={setFilters} />
      
      <SelectionControls
        totalCount={referrals.length}
        selectedCount={selectedReferrals.length}
        onRefresh={handleRefresh}
        onClearSelection={clearSelection}
        onSelectAll={selectAll}
        referrals={referrals}
      />
      
      {selectedReferrals.length > 0 && (
        <TagManager selectedReferrals={selectedReferrals} onTagged={clearSelection} />
      )}
      
      <WaitingListTable 
        referrals={referrals}
        isLoading={isLoading}
        selectedReferrals={selectedReferrals}
        onSelectReferral={toggleReferralSelection}
        onReorderReferrals={handleReorderReferrals}
      />
    </div>
  );
};

export default CohortBuilderTab;

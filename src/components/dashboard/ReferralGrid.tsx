
import { Referral } from '@/types/referral';
import ReferralCard from '@/components/ReferralCard';
import ReferralList from './ReferralList';

interface ReferralGridProps {
  referrals: Referral[];
  isLoading: boolean;
  isReordering?: boolean;
  filter?: (referral: Referral) => boolean;
  view?: 'card' | 'list';
  onReorder?: (sourceIndex: number, destinationIndex: number) => void;
  selectedIds?: Set<string>;
  onToggleSelection?: (referralId: string) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
  onRefresh?: () => void;
}

const ReferralGrid = ({ 
  referrals, 
  isLoading, 
  isReordering = false,
  filter, 
  view = 'card', 
  onReorder,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  isAllSelected,
  isIndeterminate,
  onRefresh
}: ReferralGridProps) => {
  if (view === 'list') {
    return (
      <ReferralList 
        referrals={referrals} 
        isLoading={isLoading} 
        isReordering={isReordering}
        filter={filter} 
        onReorder={onReorder}
        selectedIds={selectedIds}
        onToggleSelection={onToggleSelection}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
        isAllSelected={isAllSelected}
        onRefresh={onRefresh}
      />
    );
  }

  const filteredReferrals = filter ? referrals.filter(filter) : referrals;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-80 rounded-lg border border-border bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (filteredReferrals.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No referrals match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
      {filteredReferrals.map((referral) => (
        <ReferralCard key={referral.id} referral={referral} onTagsUpdated={onRefresh} />
      ))}
    </div>
  );
};

export default ReferralGrid;

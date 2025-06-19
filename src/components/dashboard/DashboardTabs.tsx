
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import ReferralGrid from './ReferralGrid';
import { Referral } from '@/types/referral';

interface DashboardTabsProps {
  referrals: Referral[];
  filteredReferrals: Referral[];
  isLoading: boolean;
  isReordering: boolean;
  view: 'card' | 'list';
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  selectedIds: Set<string>;
  onToggleSelection: (referralId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  isAllSelected: (referrals: Referral[]) => boolean;
  isIndeterminate: (referrals: Referral[]) => boolean;
}

const DashboardTabs = ({
  referrals,
  filteredReferrals,
  isLoading,
  isReordering,
  view,
  onReorder,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  isAllSelected,
  isIndeterminate
}: DashboardTabsProps) => {
  const handleSelectAll = () => {
    if (isAllSelected(filteredReferrals)) {
      onClearSelection();
    } else {
      onSelectAll();
    }
  };

  return (
    <EnhancedTabs defaultValue="new" className="w-full">
      <div className="flex justify-center mb-3">
        <div className="w-full max-w-2xl">
          <EnhancedTabsList variant="grid" size="md">
            <EnhancedTabsTrigger value="new" variant="grid" size="md">
              Awaiting Triage ({referrals.filter(r => r.status === 'new').length})
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger value="processed" variant="grid" size="md">
              Processed ({referrals.filter(r => r.status !== 'new').length})
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger value="all" variant="grid" size="md">
              All Referrals
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
        </div>
      </div>

      <EnhancedTabsContent value="new">
        <ReferralGrid 
          referrals={filteredReferrals} 
          isLoading={isLoading} 
          isReordering={isReordering}
          filter={(r) => r.status === 'new'}
          view={view}
          onReorder={onReorder}
          selectedIds={selectedIds}
          onToggleSelection={onToggleSelection}
          onSelectAll={handleSelectAll}
          onClearSelection={onClearSelection}
          isAllSelected={isAllSelected(filteredReferrals.filter(r => r.status === 'new'))}
          isIndeterminate={isIndeterminate(filteredReferrals.filter(r => r.status === 'new'))}
        />
      </EnhancedTabsContent>

      <EnhancedTabsContent value="processed">
        <ReferralGrid 
          referrals={filteredReferrals} 
          isLoading={isLoading} 
          isReordering={isReordering}
          filter={(r) => r.status !== 'new'}
          view={view}
          onReorder={onReorder}
          selectedIds={selectedIds}
          onToggleSelection={onToggleSelection}
          onSelectAll={handleSelectAll}
          onClearSelection={onClearSelection}
          isAllSelected={isAllSelected(filteredReferrals.filter(r => r.status !== 'new'))}
          isIndeterminate={isIndeterminate(filteredReferrals.filter(r => r.status !== 'new'))}
        />
      </EnhancedTabsContent>

      <EnhancedTabsContent value="all">
        <ReferralGrid 
          referrals={filteredReferrals} 
          isLoading={isLoading} 
          isReordering={isReordering}
          view={view} 
          onReorder={onReorder}
          selectedIds={selectedIds}
          onToggleSelection={onToggleSelection}
          onSelectAll={handleSelectAll}
          onClearSelection={onClearSelection}
          isAllSelected={isAllSelected(filteredReferrals)}
          isIndeterminate={isIndeterminate(filteredReferrals)}
        />
      </EnhancedTabsContent>
    </EnhancedTabs>
  );
};

export default DashboardTabs;

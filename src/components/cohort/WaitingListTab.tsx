
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Table2, Filter } from 'lucide-react';
import { Referral } from '@/types/referral';
import WaitingListTable from './WaitingListTable';
import WaitingListControls from './WaitingListControls';
import WaitingListStatisticsBar from './WaitingListStatisticsBar';
import AIAssistantActions from '@/components/dashboard/AIAssistantActions';

interface WaitingListTabProps {
  referrals: Referral[];
  isLoading: boolean;
  isReordering?: boolean;
  filters: any;
  updateFilters: (updates: any) => void;
  clearFilters: () => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  selectedReferrals: Referral[];
  selectedCount: number;
  toggleReferralSelection: (referral: Referral) => void;
  clearSelection: () => void;
  selectAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  handleRefresh: () => void;
  reorderReferrals: (reorderedReferrals: Referral[]) => void;
  selectedSpecialties?: string[];
}

const WaitingListTab = ({
  referrals,
  isLoading,
  isReordering = false,
  filters,
  updateFilters,
  clearFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  selectedReferrals,
  selectedCount,
  toggleReferralSelection,
  clearSelection,
  selectAll,
  isAllSelected,
  isIndeterminate,
  handleRefresh,
  reorderReferrals,
  selectedSpecialties = []
}: WaitingListTabProps) => {
  return (
    <div className="space-y-6">
      <WaitingListStatisticsBar referrals={referrals} selectedSpecialties={selectedSpecialties} />
      
      {selectedCount > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {selectedCount} referral{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </Button>
        </div>
      )}

      <Tabs defaultValue="list" className="w-full">
        <TabsList variant="default" size="md" className="w-fit">
          <TabsTrigger 
            value="list" 
            variant="default" 
            size="md"
            className="flex items-center gap-2"
          >
            <Table2 className="h-4 w-4" />
            Patient List
          </TabsTrigger>
          <TabsTrigger 
            value="filters" 
            variant="default" 
            size="md"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters & Controls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <AIAssistantActions 
              selectedReferrals={selectedReferrals}
              onClearSelection={clearSelection}
              context="waitingList"
            />
          </div>
          
          <WaitingListTable
            referrals={referrals}
            isLoading={isLoading || isReordering}
            selectedReferrals={selectedReferrals}
            onSelectReferral={toggleReferralSelection}
            onReorderReferrals={reorderReferrals}
            onSelectAll={selectAll}
            onClearSelection={clearSelection}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
          />
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <WaitingListControls
            filters={filters}
            updateFilters={updateFilters}
            clearFilters={clearFilters}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
          
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <AIAssistantActions 
              selectedReferrals={selectedReferrals}
              onClearSelection={clearSelection}
              context="waitingList"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WaitingListTab;

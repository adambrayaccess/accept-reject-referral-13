import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { PinningService } from '@/services/pinningService';
import { mapReferralData } from '@/services/referral/referralMappers';
import ReferralGrid from './ReferralGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Pin } from 'lucide-react';
import { usePinning } from '@/hooks/usePinning';

interface PinnedReferralsTabProps {
  view: 'card' | 'list';
  selectedIds: Set<string>;
  onToggleSelection: (referralId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onRefresh?: () => void;
}

const PinnedReferralsTab = ({
  view,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  isAllSelected,
  isIndeterminate,
  onRefresh
}: PinnedReferralsTabProps) => {
  const [pinnedReferrals, setPinnedReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pinnedReferralIds } = usePinning();

  useEffect(() => {
    loadPinnedReferrals();
  }, [pinnedReferralIds]); // Reload when pinned referrals change

  const loadPinnedReferrals = async () => {
    try {
      setIsLoading(true);
      const pinnedData = await PinningService.getPinnedReferralsWithData();
      
      // Transform the data to match our Referral interface
      const transformedReferrals = pinnedData.map((item: any) => 
        mapReferralData(item.referrals)
      );
      
      setPinnedReferrals(transformedReferrals);
    } catch (error) {
      console.error('Error loading pinned referrals:', error);
      setPinnedReferrals([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (pinnedReferrals.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-muted/20 rounded-full">
            <Pin className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-muted-foreground">No pinned referrals</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pin referrals by clicking the pin icon on any referral card or table row.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection();
    } else {
      onSelectAll();
    }
  };

  return (
    <ReferralGrid 
      referrals={pinnedReferrals}
      isLoading={false}
      view={view}
      selectedIds={selectedIds}
      onToggleSelection={onToggleSelection}
      onSelectAll={handleSelectAll}
      onClearSelection={onClearSelection}
      isAllSelected={isAllSelected}
      isIndeterminate={isIndeterminate}
      onRefresh={onRefresh}
    />
  );
};

export default PinnedReferralsTab;
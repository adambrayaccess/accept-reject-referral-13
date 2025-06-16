import { Referral } from '@/types/referral';
import ReferralCard from '@/components/ReferralCard';
import ReferralList from './ReferralList';

interface ReferralGridProps {
  referrals: Referral[];
  isLoading: boolean;
  filter?: (referral: Referral) => boolean;
  view?: 'card' | 'list';
  onReorder?: (reorderedReferrals: Referral[]) => void;
}

const ReferralGrid = ({ referrals, isLoading, filter, view = 'card', onReorder }: ReferralGridProps) => {
  if (view === 'list') {
    return <ReferralList referrals={referrals} isLoading={isLoading} filter={filter} onReorder={onReorder} />;
  }

  const filteredReferrals = filter ? referrals.filter(filter) : referrals;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-64 rounded-lg border border-border bg-card animate-pulse" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {filteredReferrals.map((referral) => (
        <ReferralCard key={referral.id} referral={referral} />
      ))}
    </div>
  );
};

export default ReferralGrid;

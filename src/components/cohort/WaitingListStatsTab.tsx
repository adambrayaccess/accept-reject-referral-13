
import WaitingListDashboard from './WaitingListDashboard';
import WaitingListCharts from './WaitingListCharts';
import { Referral } from '@/types/referral';

interface WaitingListStatsTabProps {
  referrals: Referral[];
  isLoading: boolean;
}

const WaitingListStatsTab = ({
  referrals,
  isLoading
}: WaitingListStatsTabProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Intelligence Dashboard */}
      <WaitingListDashboard referrals={referrals} />
      
      {/* Analytics Charts */}
      <WaitingListCharts referrals={referrals} />
    </div>
  );
};

export default WaitingListStatsTab;

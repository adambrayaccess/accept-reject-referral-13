
import CohortGrid from './CohortGrid';
import WaitingListStatisticsBar from './WaitingListStatisticsBar';
import { Referral } from '@/types/referral';

interface TaggedPatientsTabProps {
  referrals: Referral[];
  isLoading: boolean;
  selectedReferrals: Referral[];
  toggleReferralSelection: (referral: Referral) => void;
}

const TaggedPatientsTab = ({
  referrals,
  isLoading,
  selectedReferrals,
  toggleReferralSelection
}: TaggedPatientsTabProps) => {
  const taggedReferrals = referrals.filter(ref => ref.tags && ref.tags.length > 0);

  return (
    <div className="space-y-6">
      <WaitingListStatisticsBar referrals={taggedReferrals} />
      
      <CohortGrid 
        referrals={taggedReferrals}
        isLoading={isLoading}
        selectedReferrals={selectedReferrals}
        onSelectReferral={toggleReferralSelection}
        showTagsOnly
      />
    </div>
  );
};

export default TaggedPatientsTab;

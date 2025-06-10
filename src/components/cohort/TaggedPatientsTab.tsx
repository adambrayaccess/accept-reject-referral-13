
import CohortGrid from './CohortGrid';
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
    <CohortGrid 
      referrals={taggedReferrals}
      isLoading={isLoading}
      selectedReferrals={selectedReferrals}
      onSelectReferral={toggleReferralSelection}
      showTagsOnly
    />
  );
};

export default TaggedPatientsTab;

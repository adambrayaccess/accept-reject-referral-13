
import { Referral } from '@/types/referral';

interface ReferralStatusBadgeProps {
  referral: Referral;
}

const getStatusClass = (status: Referral['status']) => {
  return `status-${status}`;
};

const getStatusText = (referral: Referral) => {
  if (referral.status === 'accepted' && referral.triageStatus) {
    switch (referral.triageStatus) {
      case 'pre-assessment':
        return 'Pre-Assess';
      case 'assessed':
        return 'Assessed';
      case 'waiting-list':
        return 'Waiting List';
      case 'refer-to-another-specialty':
        return 'Refer on';
      default:
        return referral.triageStatus;
    }
  }
  return referral.status.charAt(0).toUpperCase() + referral.status.slice(1);
};

const ReferralStatusBadge = ({ referral }: ReferralStatusBadgeProps) => {
  return (
    <span className={getStatusClass(referral.status)}>
      {getStatusText(referral).toUpperCase()}
    </span>
  );
};

export default ReferralStatusBadge;

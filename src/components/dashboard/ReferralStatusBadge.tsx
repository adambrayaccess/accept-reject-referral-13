
import { Referral } from '@/types/referral';

interface ReferralStatusBadgeProps {
  referral: Referral;
}

const getStatusTextConfig = (referral: Referral) => {
  if (referral.status === 'accepted' && referral.triageStatus) {
    switch (referral.triageStatus) {
      case 'pre-assessment':
        return {
          text: 'Pre-Assess',
          colorClass: 'text-blue-600' // warning color
        };
      case 'assessed':
        return {
          text: 'Assessed',
          colorClass: 'text-[#973060]' // purple color
        };
      case 'waiting-list':
        return {
          text: 'Waiting List',
          colorClass: 'text-blue-700' // waiting-list color
        };
      case 'refer-to-another-specialty':
        return {
          text: 'Refer on',
          colorClass: 'text-teal-600' // secondary color
        };
      default:
        return {
          text: referral.triageStatus,
          colorClass: 'text-gray-600' // muted color
        };
    }
  }

  switch (referral.status) {
    case 'new':
      return {
        text: 'New',
        colorClass: 'text-teal-700' // accent color
      };
    case 'accepted':
      return {
        text: 'Accepted',
        colorClass: 'text-green-600' // success color
      };
    case 'rejected':
      return {
        text: 'Rejected',
        colorClass: 'text-red-600' // destructive color
      };
    default:
      return {
        text: referral.status.charAt(0).toUpperCase() + referral.status.slice(1),
        colorClass: 'text-gray-600' // muted color
      };
  }
};

const ReferralStatusBadge = ({ referral }: ReferralStatusBadgeProps) => {
  const { text, colorClass } = getStatusTextConfig(referral);
  
  return (
    <div className={`text-sm font-bold ${colorClass}`}>
      {text.toUpperCase()}
    </div>
  );
};

export default ReferralStatusBadge;

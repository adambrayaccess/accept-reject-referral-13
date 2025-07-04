
import { Referral } from '@/types/referral';

interface ReferralSourceBadgeProps {
  referral: Referral;
}

const getSourceText = (referral: Referral) => {
  // Use the new referral_source field from database, fallback to organization logic
  if (referral.referralSource) {
    return referral.referralSource;
  }
  
  // Fallback to organization-based logic for any missed data
  if (referral.referrer.organization) {
    if (referral.referrer.organization.toLowerCase().includes('hospital')) {
      return 'Hospital';
    }
    if (referral.referrer.organization.toLowerCase().includes('clinic')) {
      return 'Clinic';
    }
    if (referral.referrer.organization.toLowerCase().includes('emergency')) {
      return 'A&E';
    }
  }
  return 'GP';
};

const getSourceColor = (sourceText: string) => {
  switch (sourceText) {
    case 'GP':
      return 'text-green-600';
    case 'Hospital':
      return 'text-blue-600';
    case 'Clinic':
      return 'text-purple-600';
    case 'A&E':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const ReferralSourceBadge = ({ referral }: ReferralSourceBadgeProps) => {
  const sourceText = getSourceText(referral);
  const colorClass = getSourceColor(sourceText);

  return (
    <div className="space-y-1">
      <div className={`text-sm font-medium ${colorClass}`}>
        {sourceText}
      </div>
      <div className="text-xs text-muted-foreground">
        {referral.referrer.organization || 'N/A'}
      </div>
    </div>
  );
};

export default ReferralSourceBadge;

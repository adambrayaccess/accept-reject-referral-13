
import { Badge } from '@/components/ui/badge';
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

const ReferralSourceBadge = ({ referral }: ReferralSourceBadgeProps) => {
  return (
    <div className="space-y-1">
      <Badge variant="outline">
        {getSourceText(referral)}
      </Badge>
      <div className="text-sm text-muted-foreground">
        {referral.referrer.organization || 'N/A'}
      </div>
    </div>
  );
};

export default ReferralSourceBadge;

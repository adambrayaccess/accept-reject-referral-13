import { Badge } from '@/components/ui/badge';
import { Referral } from '@/types/referral';

interface ReferralTypeBadgeProps {
  referral: Referral;
  size?: 'sm' | 'default';
}

const getReferralTypeVariant = (referralType?: string) => {
  switch (referralType) {
    case 'Internal Referral':
      return 'default';
    case 'Self Referral':
      return 'secondary';
    case 'Emergency Referral':
      return 'destructive';
    case 'External Referral':
    case 'Routine Referral':
    default:
      return 'outline';
  }
};

const ReferralTypeBadge = ({ referral, size = 'default' }: ReferralTypeBadgeProps) => {
  const variant = getReferralTypeVariant(referral.referralType);
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : '';

  return (
    <Badge 
      variant={variant} 
      className={sizeClasses}
      title={`Referral Type: ${referral.referralType || 'External Referral'}`}
    >
      {referral.referralType || 'External'}
    </Badge>
  );
};

export default ReferralTypeBadge;
import { Referral } from '@/types/referral';

interface ReferralTypeBadgeProps {
  referral: Referral;
  size?: 'sm' | 'default';
}

const ReferralTypeBadge = ({ referral, size = 'default' }: ReferralTypeBadgeProps) => {
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div 
      className={`${sizeClasses} text-muted-foreground font-medium`}
      title={`Referral Type: ${referral.referralType || 'External Referral'}`}
    >
      {referral.referralType || 'External'}
    </div>
  );
};

export default ReferralTypeBadge;
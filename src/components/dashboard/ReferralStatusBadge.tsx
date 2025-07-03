
import { Referral } from '@/types/referral';
import { Badge } from '@/components/ui/badge';

interface ReferralStatusBadgeProps {
  referral: Referral;
}

const getStatusConfig = (referral: Referral) => {
  if (referral.status === 'accepted' && referral.triageStatus) {
    switch (referral.triageStatus) {
      case 'pre-assessment':
        return {
          text: 'Pre-Assess',
          className: 'bg-warning text-warning-foreground'
        };
      case 'assessed':
        return {
          text: 'Assessed',
          className: 'bg-purple text-purple-foreground'
        };
      case 'waiting-list':
        return {
          text: 'Waiting List',
          className: 'bg-primary text-primary-foreground'
        };
      case 'refer-to-another-specialty':
        return {
          text: 'Refer on',
          className: 'bg-secondary text-secondary-foreground'
        };
      default:
        return {
          text: referral.triageStatus,
          className: 'bg-muted text-muted-foreground'
        };
    }
  }

  switch (referral.status) {
    case 'new':
      return {
        text: 'New',
        className: 'bg-accent text-accent-foreground'
      };
    case 'accepted':
      return {
        text: 'Accepted',
        className: 'bg-success text-success-foreground'
      };
    case 'rejected':
      return {
        text: 'Rejected',
        className: 'bg-destructive text-destructive-foreground'
      };
    default:
      return {
        text: referral.status.charAt(0).toUpperCase() + referral.status.slice(1),
        className: 'bg-muted text-muted-foreground'
      };
  }
};

const ReferralStatusBadge = ({ referral }: ReferralStatusBadgeProps) => {
  const { text, className } = getStatusConfig(referral);
  
  return (
    <Badge variant="secondary" className={className}>
      {text.toUpperCase()}
    </Badge>
  );
};

export default ReferralStatusBadge;


import { Badge } from '@/components/ui/badge';
import { Referral } from '@/types/referral';

interface ReferralPriorityBadgeProps {
  priority: Referral['priority'];
}

const getPriorityVariant = (priority: Referral['priority']) => {
  switch (priority) {
    case 'emergency':
      return 'destructive';
    case 'urgent':
      return 'secondary';
    default:
      return 'outline';
  }
};

const ReferralPriorityBadge = ({ priority }: ReferralPriorityBadgeProps) => {
  return (
    <Badge 
      variant={getPriorityVariant(priority)}
      className={priority === 'urgent' ? 'bg-[#973060] text-white hover:bg-[#973060]/80' : ''}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};

export default ReferralPriorityBadge;

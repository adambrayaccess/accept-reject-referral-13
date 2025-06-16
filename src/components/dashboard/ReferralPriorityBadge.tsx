
import { Badge } from '@/components/ui/badge';
import { Referral } from '@/types/referral';
import { cn } from '@/lib/utils';

interface ReferralPriorityBadgeProps {
  priority: Referral['priority'];
  className?: string;
  size?: 'sm' | 'default';
}

export const getPriorityVariant = (priority: Referral['priority']) => {
  switch (priority) {
    case 'emergency':
      return 'destructive';
    case 'urgent':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const getPriorityCustomStyles = (priority: Referral['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-[#973060] text-white hover:bg-[#973060]/80';
    default:
      return '';
  }
};

const ReferralPriorityBadge = ({ priority, className, size = 'default' }: ReferralPriorityBadgeProps) => {
  const variant = getPriorityVariant(priority);
  const customStyles = getPriorityCustomStyles(priority);
  const sizeClasses = size === 'sm' ? 'text-xs' : '';

  return (
    <Badge 
      variant={variant}
      className={cn(customStyles, sizeClasses, className)}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};

export default ReferralPriorityBadge;


import { Referral } from '@/types/referral';
import { cn } from '@/lib/utils';
import { 
  getPriorityLabel 
} from '@/lib/priorityUtils';

interface ReferralPriorityBadgeProps {
  priority: Referral['priority'];
  className?: string;
  size?: 'sm' | 'default';
}

const getPriorityTextColor = (priority: Referral['priority']) => {
  switch (priority) {
    case 'emergency':
      return 'text-red-600'; // destructive color
    case 'urgent':
      return 'text-[#973060]'; // purple color
    case 'routine':
      return 'text-teal-600'; // secondary/teal color
    default:
      return 'text-gray-600';
  }
};

const ReferralPriorityBadge = ({ priority, className, size = 'default' }: ReferralPriorityBadgeProps) => {
  const colorClass = getPriorityTextColor(priority);
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={cn('font-bold', colorClass, sizeClasses, className)}>
      {getPriorityLabel(priority)}
    </div>
  );
};

export default ReferralPriorityBadge;

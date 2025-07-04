
import { Badge } from '@/components/ui/badge';
import { Referral } from '@/types/referral';
import { cn } from '@/lib/utils';
import { 
  getPriorityVariant, 
  getPriorityCustomStyles, 
  getPriorityLabel 
} from '@/lib/priorityUtils';

interface ReferralPriorityBadgeProps {
  priority: Referral['priority'];
  className?: string;
  size?: 'sm' | 'default';
}

const ReferralPriorityBadge = ({ priority, className, size = 'default' }: ReferralPriorityBadgeProps) => {
  const variant = getPriorityVariant(priority);
  const customStyles = getPriorityCustomStyles(priority);
  const sizeClasses = size === 'sm' ? 'text-xs' : '';

  return (
    <Badge 
      variant={variant}
      className={cn(customStyles, sizeClasses, className)}
    >
      {getPriorityLabel(priority)}
    </Badge>
  );
};

export default ReferralPriorityBadge;

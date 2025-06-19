
import { Badge } from '@/components/ui/badge';
import { AllergySeverity } from '@/types/allergy';
import { cn } from '@/lib/utils';

interface AllergySeverityBadgeProps {
  severity: AllergySeverity;
  size?: 'sm' | 'md' | 'lg';
}

const AllergySeverityBadge = ({ severity, size = 'md' }: AllergySeverityBadgeProps) => {
  const getVariantAndColor = (severity: AllergySeverity) => {
    switch (severity) {
      case 'life-threatening':
        return { variant: 'destructive' as const, className: 'bg-red-600 text-white animate-pulse' };
      case 'severe':
        return { variant: 'destructive' as const, className: 'bg-red-500 text-white' };
      case 'moderate':
        return { variant: 'secondary' as const, className: 'bg-orange-500 text-white' };
      case 'mild':
        return { variant: 'secondary' as const, className: 'bg-yellow-500 text-white' };
      default:
        return { variant: 'outline' as const, className: '' };
    }
  };

  const { variant, className } = getVariantAndColor(severity);
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1'
  };

  return (
    <Badge 
      variant={variant} 
      className={cn(sizeClasses[size], className)}
    >
      {severity.replace('-', ' ').toUpperCase()}
    </Badge>
  );
};

export default AllergySeverityBadge;

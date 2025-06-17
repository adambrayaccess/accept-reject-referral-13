
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { RTTBreachRisk } from '@/types/referral';
import { getRTTStatusColor, formatRTTStatus } from '@/utils/rttPathwayUtils';

interface RTTPathwayBadgeProps {
  breachRisk: RTTBreachRisk;
  daysRemaining: number;
  variant?: 'default' | 'compact';
}

const RTTPathwayBadge = ({ breachRisk, daysRemaining, variant = 'default' }: RTTPathwayBadgeProps) => {
  const colorClass = getRTTStatusColor(breachRisk);
  const statusText = formatRTTStatus(breachRisk, daysRemaining);
  
  const getIcon = () => {
    switch (breachRisk) {
      case 'breached':
        return <AlertTriangle className="w-3 h-3" />;
      case 'high':
        return <AlertTriangle className="w-3 h-3" />;
      case 'medium':
        return <Clock className="w-3 h-3" />;
      case 'low':
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
        {getIcon()}
        <span>{daysRemaining}d</span>
      </div>
    );
  }

  return (
    <Badge variant="outline" className={`${colorClass} flex items-center gap-1`}>
      {getIcon()}
      <span>{statusText}</span>
    </Badge>
  );
};

export default RTTPathwayBadge;

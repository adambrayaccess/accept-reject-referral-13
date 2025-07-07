import { Badge } from '@/components/ui/badge';
import { Referral } from '@/types/referral';
import { calculateRTTPathway } from '@/utils/rttPathwayUtils';

interface WaitingListStatusBadgeProps {
  referral: Referral;
}

const WaitingListStatusBadge = ({ referral }: WaitingListStatusBadgeProps) => {
  // Check if referral is discharged
  const isDischarged = referral.status === 'discharged';
  
  // Calculate RTT pathway to get days remaining
  const rttPathway = referral.rttPathway || calculateRTTPathway(referral.created);
  const daysRemaining = rttPathway.daysRemaining;

  // Determine status and styling based on discharge status or days remaining
  const getStatusInfo = (days: number) => {
    if (isDischarged) {
      return {
        label: 'Discharged',
        className: 'bg-muted/10 text-muted-foreground border-muted/20'
      };
    }
    
    if (days <= 0) {
      return {
        label: 'Exceeded',
        className: 'bg-destructive/10 text-destructive border-destructive/20'
      };
    } else if (days < 28) {
      return {
        label: 'Warning',
        className: 'bg-warning/10 text-warning border-warning/20'
      };
    } else {
      return {
        label: 'Active',
        className: 'bg-success/10 text-success border-success/20'
      };
    }
  };

  const statusInfo = getStatusInfo(daysRemaining);

  return (
    <Badge 
      variant="outline" 
      className={`text-xs ${statusInfo.className}`}
    >
      {statusInfo.label}
    </Badge>
  );
};

export default WaitingListStatusBadge;
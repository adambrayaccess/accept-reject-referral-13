import { AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { Referral } from '@/types/referral';
import { calculateRTTPathway } from '@/utils/rttPathwayUtils';

interface WaitingListStatus {
  type: 'active' | 'warning' | 'exceeded';
  label: string;
  daysRemaining: number;
}

interface WaitingListStatusIndicatorProps {
  referral: Referral;
  onClick?: () => void;
  showExternalLink?: boolean;
}

const WaitingListStatusIndicator = ({ referral, onClick, showExternalLink }: WaitingListStatusIndicatorProps) => {
  // Calculate RTT pathway to get days remaining
  const rttPathway = referral.rttPathway || calculateRTTPathway(referral.created);
  const daysRemaining = rttPathway.daysRemaining;

  // Determine waiting list status based on days remaining
  const getWaitingListStatus = (days: number): WaitingListStatus => {
    if (days <= 0) {
      return {
        type: 'exceeded',
        label: 'Exceeded',
        daysRemaining: days
      };
    } else if (days < 28) {
      return {
        type: 'warning',
        label: 'Warning',
        daysRemaining: days
      };
    } else {
      return {
        type: 'active',
        label: 'Active',
        daysRemaining: days
      };
    }
  };

  const status = getWaitingListStatus(daysRemaining);

  const getIcon = () => {
    switch (status.type) {
      case 'exceeded':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'active':
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (status.type) {
      case 'exceeded':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'active':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getDaysText = () => {
    if (status.daysRemaining <= 0) {
      const daysOver = Math.abs(status.daysRemaining);
      return `${daysOver} day${daysOver !== 1 ? 's' : ''} exceeded`;
    } else {
      return `${status.daysRemaining} day${status.daysRemaining !== 1 ? 's' : ''} remaining`;
    }
  };

  const content = (
    <div className={`border rounded-lg p-4 ${getStatusColor()} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <div className="font-medium">Waiting List Status: {status.label}</div>
            <div className="text-sm opacity-75">RTT: {getDaysText()}</div>
          </div>
        </div>
        {showExternalLink && (
          <ExternalLink className="h-4 w-4 opacity-60" />
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
};

export default WaitingListStatusIndicator;
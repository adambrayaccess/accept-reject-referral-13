
import { CheckCircle, XCircle, Pencil } from 'lucide-react';
import { Referral } from '@/types/referral';
import { format } from 'date-fns';

interface ReferralStatusIndicatorProps {
  referral: Referral;
  onClick?: () => void;
  showExternalLink?: boolean;
}

const ReferralStatusIndicator = ({ referral, onClick, showExternalLink }: ReferralStatusIndicatorProps) => {
  if (referral.status === 'new') return null;

  const formatLastUpdate = () => {
    if (referral.created) {
      return format(new Date(referral.created), 'dd/MM/yyyy HH:mm');
    }
    return 'Unknown';
  };

  const content = (
    <div className={`border rounded-lg p-4 bg-muted/50 ${onClick ? 'cursor-pointer hover:bg-muted/70 transition-colors' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {referral.status === 'accepted' ? (
              <>
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium text-success">This referral has been accepted</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="font-medium text-destructive">This referral has been rejected</span>
              </>
            )}
          </div>
          {referral.status === 'accepted' && (
            <div className="text-xs text-muted-foreground ml-7">
              Status: {referral.triageStatus || 'Not set'} • Last Update: {formatLastUpdate()}
            </div>
          )}
        </div>
        {showExternalLink && (
          <Pencil className="h-4 w-4 text-muted-foreground" />
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

export default ReferralStatusIndicator;

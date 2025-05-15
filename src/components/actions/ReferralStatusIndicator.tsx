
import { CheckCircle, XCircle } from 'lucide-react';
import { Referral } from '@/types/referral';

interface ReferralStatusIndicatorProps {
  status: Referral['status'];
}

const ReferralStatusIndicator = ({ status }: ReferralStatusIndicatorProps) => {
  if (status === 'new') return null;

  return (
    <div className="border rounded-lg p-4 bg-muted/50">
      <div className="flex items-center gap-2">
        {status === 'accepted' ? (
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
    </div>
  );
};

export default ReferralStatusIndicator;

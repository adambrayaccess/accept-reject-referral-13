
import { Referral } from '@/types/referral';
import AcceptReferralDialog from './actions/AcceptReferralDialog';
import RejectReferralDialog from './actions/RejectReferralDialog';
import ForwardReferralDialog from './actions/ForwardReferralDialog';
import ReferralStatusIndicator from './actions/ReferralStatusIndicator';

interface ReferralActionsProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ReferralActions = ({ referral, onStatusChange }: ReferralActionsProps) => {
  if (referral.status !== 'new') {
    return <ReferralStatusIndicator status={referral.status} />;
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AcceptReferralDialog referral={referral} onStatusChange={onStatusChange} />
        <RejectReferralDialog referral={referral} onStatusChange={onStatusChange} />
      </div>
      <ForwardReferralDialog referral={referral} onStatusChange={onStatusChange} />
    </div>
  );
};

export default ReferralActions;

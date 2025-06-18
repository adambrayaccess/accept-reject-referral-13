
import { Referral } from '@/types/referral';
import AcceptReferralDialog from './actions/AcceptReferralDialog';
import RejectReferralDialog from './actions/RejectReferralDialog';
import ReferralStatusIndicator from './actions/ReferralStatusIndicator';
import TriageStatusUpdate from './triage/TriageStatusUpdate';

interface ReferralActionsProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ReferralActions = ({ referral, onStatusChange }: ReferralActionsProps) => {
  console.log('ReferralActions rendering with referral:', {
    id: referral.id,
    status: referral.status,
    triageStatus: referral.triageStatus,
    teamId: referral.teamId,
    assignedHCPId: referral.assignedHCPId
  });

  if (referral.status === 'new') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AcceptReferralDialog referral={referral} onStatusChange={onStatusChange} />
        <RejectReferralDialog referral={referral} onStatusChange={onStatusChange} />
      </div>
    );
  }

  if (referral.status === 'accepted') {
    return (
      <div className="space-y-4">
        <ReferralStatusIndicator status={referral.status} />
        <TriageStatusUpdate 
          referralId={referral.id}
          currentStatus={referral.triageStatus}
          specialty={referral.specialty}
          onStatusChange={onStatusChange}
        />
      </div>
    );
  }

  return <ReferralStatusIndicator status={referral.status} />;
};

export default ReferralActions;

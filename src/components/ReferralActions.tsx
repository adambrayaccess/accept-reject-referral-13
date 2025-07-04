
import { Referral } from '@/types/referral';
import AcceptReferralDialog from './actions/AcceptReferralDialog';
import RejectReferralDialog from './actions/RejectReferralDialog';
import ReferralStatusIndicator from './actions/ReferralStatusIndicator';
import { useState } from 'react';

interface ReferralActionsProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ReferralActions = ({ referral, onStatusChange }: ReferralActionsProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  console.log('ReferralActions rendering with referral:', {
    id: referral.id,
    status: referral.status,
    triageStatus: referral.triageStatus,
    teamId: referral.teamId,
    assignedHCPId: referral.assignedHCPId
  });

  const handleStatusIndicatorClick = () => {
    if (referral.status === 'accepted') {
      setShowAcceptDialog(true);
    } else if (referral.status === 'rejected') {
      setShowRejectDialog(true);
    }
  };

  const handleDialogStatusChange = () => {
    setShowAcceptDialog(false);
    setShowRejectDialog(false);
    onStatusChange();
  };

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
      <>
        <ReferralStatusIndicator 
          status={referral.status} 
          onClick={handleStatusIndicatorClick}
          showExternalLink={true}
        />
        <AcceptReferralDialog 
          referral={referral} 
          onStatusChange={handleDialogStatusChange}
          open={showAcceptDialog}
          onOpenChange={setShowAcceptDialog}
        />
      </>
    );
  }

  return (
    <>
      <ReferralStatusIndicator 
        status={referral.status} 
        onClick={handleStatusIndicatorClick}
        showExternalLink={true}
      />
      <RejectReferralDialog 
        referral={referral} 
        onStatusChange={handleDialogStatusChange}
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
      />
    </>
  );
};

export default ReferralActions;

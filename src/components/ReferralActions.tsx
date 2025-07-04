
import { Referral } from '@/types/referral';
import AcceptReferralDialog from './actions/AcceptReferralDialog';
import RejectReferralDialog from './actions/RejectReferralDialog';
import ReferralStatusIndicator from './actions/ReferralStatusIndicator';
import TriageStatusUpdate from './triage/TriageStatusUpdate';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ReferralActionsProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ReferralActions = ({ referral, onStatusChange }: ReferralActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="space-y-4">
            <CollapsibleTrigger className="w-full group">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex-1">
                  <ReferralStatusIndicator 
                    status={referral.status} 
                    onClick={handleStatusIndicatorClick}
                    showExternalLink={true}
                  />
                </div>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-all duration-200 text-muted-foreground group-hover:text-primary group-hover:bg-accent/50 group-hover:rounded-sm group-hover:p-0.5 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <TriageStatusUpdate 
                referralId={referral.id}
                currentStatus={referral.triageStatus}
                specialty={referral.specialty}
                onStatusChange={onStatusChange}
              />
            </CollapsibleContent>
          </div>
        </Collapsible>
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

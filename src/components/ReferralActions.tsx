
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="space-y-4">
          <CollapsibleTrigger className="w-full group">
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex-1">
                <ReferralStatusIndicator status={referral.status} />
              </div>
              <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-all duration-200 group-hover:text-purple-600 ${isOpen ? 'rotate-180' : ''}`} />
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
    );
  }

  return <ReferralStatusIndicator status={referral.status} />;
};

export default ReferralActions;

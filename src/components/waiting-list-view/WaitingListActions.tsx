import { useState } from 'react';
import { Referral } from '@/types/referral';
import WaitingListStatusIndicator from './WaitingListStatusIndicator';
import WaitingListActionsSheet from './WaitingListActionsSheet';

interface WaitingListActionsProps {
  referral: Referral;
  onStatusChange: () => void;
}

const WaitingListActions = ({ referral, onStatusChange }: WaitingListActionsProps) => {
  const [showActionsSheet, setShowActionsSheet] = useState(false);

  const handleStatusIndicatorClick = () => {
    setShowActionsSheet(true);
  };

  const handleSheetStatusChange = () => {
    setShowActionsSheet(false);
    onStatusChange();
  };

  return (
    <>
      <WaitingListStatusIndicator 
        referral={referral}
        onClick={handleStatusIndicatorClick}
        showExternalLink={true}
      />
      <WaitingListActionsSheet 
        referral={referral}
        open={showActionsSheet}
        onOpenChange={setShowActionsSheet}
        onStatusChange={handleSheetStatusChange}
      />
    </>
  );
};

export default WaitingListActions;
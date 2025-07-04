
import { TableCell } from '@/components/ui/table';
import { ChevronRight } from 'lucide-react';
import { Referral } from '@/types/referral';
import SubReferralIndicator from './SubReferralIndicator';

interface PatientRowActionsProps {
  referral: Referral;
}

const PatientRowActions = ({ referral }: PatientRowActionsProps) => {
  return (
    <>
      <TableCell className="p-2">
        <SubReferralIndicator referral={referral} variant="compact" />
      </TableCell>
      <TableCell className="p-2">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </TableCell>
    </>
  );
};

export default PatientRowActions;

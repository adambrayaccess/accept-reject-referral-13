
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Referral } from '@/types/referral';
import PatientDetailsPopover from '@/components/PatientDetailsPopover';

interface PatientInfoProps {
  referral: Referral;
  isDragDisabled: boolean;
  onNameClick?: (referral: Referral) => void;
}

const PatientInfo = ({ referral, isDragDisabled, onNameClick }: PatientInfoProps) => {
  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragDisabled && onNameClick) {
      onNameClick(referral);
    }
  };

  return (
    <TableCell className="p-2">
      <div className="flex items-center justify-between">
        <div>
          <PatientDetailsPopover patient={referral.patient}>
            <Button
              variant="link"
              className="font-bold underline p-0 h-auto text-sm"
              style={{ color: '#007373' }}
              onClick={handleNameClick}
              disabled={isDragDisabled}
            >
              {referral.patient.name}
            </Button>
          </PatientDetailsPopover>
        </div>
      </div>
    </TableCell>
  );
};

export default PatientInfo;

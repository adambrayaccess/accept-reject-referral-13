
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Referral } from '@/types/referral';

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
          <Button
            variant="link"
            className="font-bold underline p-0 h-auto text-sm"
            style={{ color: '#007373' }}
            onClick={handleNameClick}
            disabled={isDragDisabled}
          >
            {referral.patient.name}
          </Button>
          <div className="text-sm text-muted-foreground font-mono">
            NHS: {referral.patient.nhsNumber}
          </div>
        </div>
      </div>
    </TableCell>
  );
};

export default PatientInfo;

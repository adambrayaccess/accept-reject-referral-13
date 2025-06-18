
import { TableCell } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Referral } from '@/types/referral';

interface PatientInfoProps {
  referral: Referral;
  isDragDisabled: boolean;
}

const PatientInfo = ({ referral, isDragDisabled }: PatientInfoProps) => {
  return (
    <TableCell className="p-2">
      <div className="flex items-center justify-between">
        <div>
          <Link 
            to={`/referral/${referral.id}`}
            className="font-bold underline text-sm"
            style={{ color: '#007373' }}
            onClick={(e) => !isDragDisabled && e.stopPropagation()}
          >
            {referral.patient.name}
          </Link>
          <div className="text-sm text-muted-foreground font-mono">
            NHS: {referral.patient.nhsNumber}
          </div>
        </div>
      </div>
    </TableCell>
  );
};

export default PatientInfo;

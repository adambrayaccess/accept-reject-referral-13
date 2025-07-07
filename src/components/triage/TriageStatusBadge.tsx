
import { Badge } from '@/components/ui/badge';
import { TriageStatus } from '@/types/referral';

interface TriageStatusBadgeProps {
  status?: TriageStatus;
}

const getTriageStatusVariant = (status?: TriageStatus) => {
  switch (status) {
    case 'pre-assessment':
      return 'secondary';
    case 'assessed':
      return 'default';
    case 'pre-admission-assessment':
      return 'outline';
    case 'waiting-list':
      return 'destructive';
    case 'refer-to-another-specialty':
      return 'secondary';
    case 'discharged':
      return 'outline';
    default:
      return 'outline';
  }
};

const getTriageStatusLabel = (status?: TriageStatus) => {
  switch (status) {
    case 'pre-assessment':
      return 'Pre-Assessment';
    case 'assessed':
      return 'Assessed';
    case 'pre-admission-assessment':
      return 'Pre-Admission Assessment';
    case 'waiting-list':
      return 'Waiting List';
    case 'refer-to-another-specialty':
      return 'Refer to Another Specialty';
    case 'discharged':
      return 'Discharged';
    default:
      return 'No Status';
  }
};

const getTriageStatusColor = (status?: TriageStatus) => {
  switch (status) {
    case 'pre-assessment':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
    case 'assessed':
      return 'bg-green-100 text-green-800 hover:bg-green-100/80';
    case 'pre-admission-assessment':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80';
    case 'waiting-list':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100/80';
    case 'refer-to-another-specialty':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100/80';
    case 'discharged':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
  }
};

const TriageStatusBadge = ({ status }: TriageStatusBadgeProps) => {
  if (!status) return null;

  return (
    <Badge 
      variant="outline" 
      className={`text-xs ${getTriageStatusColor(status)}`}
    >
      {getTriageStatusLabel(status)}
    </Badge>
  );
};

export default TriageStatusBadge;


import { TableCell } from '@/components/ui/table';
import { Calendar, MapPin } from 'lucide-react';
import { Referral } from '@/types/referral';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';
import {
  calculateReferralAgeDays,
  calculatePatientAge,
  getLocationFromAddress
} from './utils/waitingListUtils';

interface PatientMetricsProps {
  referral: Referral;
}

const PatientMetrics = ({ referral }: PatientMetricsProps) => {
  const referralAge = calculateReferralAgeDays(referral.created);
  const patientAge = calculatePatientAge(referral.patient.birthDate);
  const location = getLocationFromAddress(referral.patient.address);

  return (
    <>
      <TableCell className="p-2 text-sm">{patientAge} years</TableCell>
      <TableCell className="p-2">
        <ReferralPriorityBadge priority={referral.priority} />
      </TableCell>
      <TableCell className="p-2 text-sm">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{referralAge} days</span>
        </div>
      </TableCell>
      <TableCell className="p-2 text-sm">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span>{location}</span>
        </div>
      </TableCell>
    </>
  );
};

export default PatientMetrics;

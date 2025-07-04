
import { TableCell } from '@/components/ui/table';
import { Referral } from '@/types/referral';
import AppointmentStatus from './AppointmentStatus';
import RTTPathwayBadge from './RTTPathwayBadge';
import CarePathwayBadge from './CarePathwayBadge';
import TeamBadge from '@/components/team/TeamBadge';
import { formatTargetDate, calculateRTTPathway } from '@/utils/rttPathwayUtils';

interface PatientStatusInfoProps {
  referral: Referral;
}

const PatientStatusInfo = ({ referral }: PatientStatusInfoProps) => {
  // Calculate RTT pathway if not present, similar to RTTPathwayTabContent
  const rttPathway = referral.rttPathway || calculateRTTPathway(referral.created);
  
  return (
    <>
      <TableCell className="p-2">
        <AppointmentStatus referral={referral} variant="compact" />
      </TableCell>
      <TableCell className="p-2 text-sm">
        <div>{formatTargetDate(rttPathway.targetDate)}</div>
      </TableCell>
      <TableCell className="p-2">
        {referral.carePathway ? (
          <CarePathwayBadge 
            carePathway={referral.carePathway}
            variant="compact"
          />
        ) : (
          <span className="text-sm text-muted-foreground">No pathway</span>
        )}
      </TableCell>
      <TableCell className="p-2">
        <RTTPathwayBadge 
          breachRisk={rttPathway.breachRisk}
          daysRemaining={rttPathway.daysRemaining}
          variant="compact"
        />
      </TableCell>
      <TableCell className="p-2">
        {referral.teamId ? (
          <TeamBadge teamId={referral.teamId} size="sm" />
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        )}
      </TableCell>
    </>
  );
};

export default PatientStatusInfo;

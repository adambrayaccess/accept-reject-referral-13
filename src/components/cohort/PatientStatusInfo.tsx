
import { TableCell } from '@/components/ui/table';
import { Referral } from '@/types/referral';
import AppointmentStatus from './AppointmentStatus';
import RTTPathwayBadge from './RTTPathwayBadge';
import CarePathwayBadge from './CarePathwayBadge';
import TeamBadge from '@/components/team/TeamBadge';
import { formatTargetDate } from '@/utils/rttPathwayUtils';

interface PatientStatusInfoProps {
  referral: Referral;
}

const PatientStatusInfo = ({ referral }: PatientStatusInfoProps) => {
  return (
    <>
      <TableCell className="p-2">
        <AppointmentStatus referral={referral} variant="compact" />
      </TableCell>
      <TableCell className="p-2 text-sm">
        {referral.rttPathway ? (
          <div>{formatTargetDate(referral.rttPathway.targetDate)}</div>
        ) : (
          <span className="text-muted-foreground">Not set</span>
        )}
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
        {referral.rttPathway ? (
          <RTTPathwayBadge 
            breachRisk={referral.rttPathway.breachRisk}
            daysRemaining={referral.rttPathway.daysRemaining}
            variant="compact"
          />
        ) : (
          <span className="text-sm text-muted-foreground">No RTT data</span>
        )}
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


import { TableCell } from '@/components/ui/table';
import { Referral } from '@/types/referral';
import AppointmentStatus from './AppointmentStatus';
import RTTPathwayBadge from './RTTPathwayBadge';
import CarePathwayBadge from './CarePathwayBadge';
import { formatTargetDate, calculateRTTPathway } from '@/utils/rttPathwayUtils';
import { fetchTeamById } from '@/services/teamService';
import { useState, useEffect } from 'react';

interface PatientStatusInfoProps {
  referral: Referral;
}

const PatientStatusInfo = ({ referral }: PatientStatusInfoProps) => {
  // Calculate RTT pathway if not present, similar to RTTPathwayTabContent
  const rttPathway = referral.rttPathway || calculateRTTPathway(referral.created);
  
  const [teamName, setTeamName] = useState<string | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  useEffect(() => {
    const loadTeam = async () => {
      if (!referral.teamId) return;
      
      setIsLoadingTeam(true);
      try {
        const teamData = await fetchTeamById(referral.teamId);
        setTeamName(teamData?.name || null);
      } catch (error) {
        console.error('Error loading team:', error);
        setTeamName(null);
      } finally {
        setIsLoadingTeam(false);
      }
    };

    loadTeam();
  }, [referral.teamId]);
  
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
      <TableCell className="p-2 text-sm">
        {referral.teamId ? (
          isLoadingTeam ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : teamName ? (
            <span>{teamName}</span>
          ) : (
            <span className="text-muted-foreground">Unknown Team</span>
          )
        ) : (
          <span className="text-muted-foreground">Unassigned</span>
        )}
      </TableCell>
    </>
  );
};

export default PatientStatusInfo;

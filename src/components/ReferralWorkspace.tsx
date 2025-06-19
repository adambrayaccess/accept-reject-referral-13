
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { History, Calendar, Clipboard, Users } from 'lucide-react';
import { Referral } from '@/types/referral';
import ReferralActions from './ReferralActions';
import AuditLog from './audit/AuditLog';
import SubReferralsList from './sub-referrals/SubReferralsList';
import ParentReferralInfo from './sub-referrals/ParentReferralInfo';
import PatientJourney from './PatientJourney';
import ReferralTagging from './referral-tagging/ReferralTagging';
import AISuggestionsPanel from './ai-suggestions/AISuggestionsPanel';
import AppointmentStatus from './cohort/AppointmentStatus';
import TeamBadge from './team/TeamBadge';

interface ReferralWorkspaceProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ReferralWorkspace = ({ referral, onStatusChange }: ReferralWorkspaceProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTagsUpdated = () => {
    // Refresh parent component to show updated tags
    onStatusChange();
  };

  const handleAISuggestionApplied = () => {
    // Refresh the entire view when AI suggestions are applied
    onStatusChange();
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {referral.isSubReferral && referral.parentReferralId && (
        <ParentReferralInfo childReferralId={referral.id} />
      )}

      {/* AI Suggestions Panel - Now shown for all referrals */}
      <AISuggestionsPanel 
        referral={referral}
        onSuggestionApplied={handleAISuggestionApplied}
      />

      {/* Team Allocation Card - NEW */}
      {referral.teamId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Team Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <TeamBadge teamId={referral.teamId} />
              {referral.assignedHCPId && (
                <div className="text-sm text-muted-foreground">
                  Assigned to: {/* Add HCP name lookup here */}
                  <span className="font-medium">Individual Healthcare Professional</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Triage Actions Card - MOVED ABOVE Appointment Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Clipboard className="h-5 w-5 mr-2" />
            Triage Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ReferralActions referral={referral} onStatusChange={onStatusChange} />
        </CardContent>
      </Card>

      {/* Appointment Status Card - NOW BELOW Triage Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Appointment Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <AppointmentStatus referral={referral} />
        </CardContent>
      </Card>

      {/* Sub-referrals List - Now shown for all non-sub-referrals regardless of status */}
      {!referral.isSubReferral && (
        <SubReferralsList 
          parentReferralId={referral.id}
          onRefresh={refreshKey}
        />
      )}

      <ReferralTagging 
        referral={referral}
        onTagsUpdated={handleTagsUpdated}
      />

      <PatientJourney referral={referral} />

      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <History className="h-5 w-5 mr-2" />
            Triage History
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <AuditLog entries={referral.auditLog} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralWorkspace;

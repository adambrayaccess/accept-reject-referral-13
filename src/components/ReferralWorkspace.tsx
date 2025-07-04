
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Calendar, Clipboard, Users, FileText } from 'lucide-react';
import { Referral } from '@/types/referral';
import ReferralActions from './ReferralActions';
import EnhancedAuditLog from './audit/EnhancedAuditLog';
import SubReferralsList from './sub-referrals/SubReferralsList';
import ParentReferralInfo from './sub-referrals/ParentReferralInfo';
import PatientJourney from './PatientJourney';
import ReferralTagging from './referral-tagging/ReferralTagging';
import AppointmentStatus from './cohort/AppointmentStatus';
import TeamBadge from './team/TeamBadge';
import HCPBadge from './team/HCPBadge';
import AddClinicalNoteSheet from './clinical-notes/AddClinicalNoteSheet';

interface ReferralWorkspaceProps {
  referral: Referral;
  onStatusChange: () => void;
  onSuggestionApplied?: () => void;
}

const ReferralWorkspace = ({ referral, onStatusChange, onSuggestionApplied }: ReferralWorkspaceProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  const handleTagsUpdated = () => {
    // Refresh parent component to show updated tags
    onStatusChange();
  };

  const handleAISuggestionApplied = () => {
    // Refresh the entire view when AI suggestions are applied
    onSuggestionApplied?.();
    onStatusChange();
  };

  const handleNoteCreated = () => {
    // Refresh to show new note in audit log
    onStatusChange();
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Add Clinical Note Button - Moved to top */}
      <Button 
        onClick={() => setIsAddNoteOpen(true)}
        className="w-full flex items-center gap-2 text-white hover:bg-[#007A7A]/90"
        style={{ backgroundColor: '#007A7A' }}
        variant="default"
      >
        <FileText className="h-4 w-4" />
        Add Note
      </Button>

      {referral.isSubReferral && referral.parentReferralId && (
        <ParentReferralInfo childReferralId={referral.id} />
      )}

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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TeamBadge teamId={referral.teamId} />
              </div>
              {referral.assignedHCPId && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Assigned to:</span>
                  <HCPBadge hcpId={referral.assignedHCPId} />
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
          <EnhancedAuditLog entries={referral.auditLog} referralId={referral.id} />
        </CardContent>
      </Card>

      {/* Add Clinical Note Sheet */}
      <AddClinicalNoteSheet
        referralId={referral.id}
        patientName={referral.patient.name}
        isOpen={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        onNoteCreated={handleNoteCreated}
      />
    </div>
  );
};

export default ReferralWorkspace;

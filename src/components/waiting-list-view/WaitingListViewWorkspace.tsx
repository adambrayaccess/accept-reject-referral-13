import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Calendar, Timer, Users, FileText } from 'lucide-react';
import { Referral } from '@/types/referral';
import WaitingListActions from './WaitingListActions';
import EnhancedAuditLog from '@/components/audit/EnhancedAuditLog';
import ReferralTagging from '@/components/referral-tagging/ReferralTagging';
import AppointmentStatus from '@/components/cohort/AppointmentStatus';
import TeamBadge from '@/components/team/TeamBadge';
import HCPBadge from '@/components/team/HCPBadge';
import AddClinicalNoteSheet from '@/components/clinical-notes/AddClinicalNoteSheet';
import InpatientHistory from './InpatientHistory';
import { TriageHistoryButton, TriageHistorySheet } from '@/components/triage-history';
import PatientJourneyButton from '@/components/PatientJourneyButton';

interface WaitingListViewWorkspaceProps {
  referral: Referral;
  onStatusChange: () => void;
  onSuggestionApplied?: () => void;
}

const WaitingListViewWorkspace = ({ referral, onStatusChange, onSuggestionApplied }: WaitingListViewWorkspaceProps) => {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isTriageHistoryOpen, setIsTriageHistoryOpen] = useState(false);

  const handleStatusChange = () => {
    setRefreshTrigger(prev => prev + 1);
    onStatusChange();
  };

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
      {/* Add Clinical Note Button - At top for Waiting List View */}
      <Button 
        onClick={() => setIsAddNoteOpen(true)}
        className="w-full flex items-center gap-2 text-white hover:bg-[#007A7A]/90"
        style={{ backgroundColor: '#007A7A' }}
        variant="default"
      >
        <FileText className="h-4 w-4" />
        Add Note
      </Button>

      {/* Patient Journey Button - Light teal color */}
      <div className="w-full">
        <PatientJourneyButton referral={referral} />
      </div>

      {/* Team Allocation Card */}
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

      {/* Waiting List Actions Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Timer className="h-5 w-5 mr-2" />
            Waiting List Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <WaitingListActions referral={referral} onStatusChange={handleStatusChange} />
        </CardContent>
      </Card>

      {/* Appointment Status Card */}
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

      {/* Inpatient History - New component above clinical tags */}
      <InpatientHistory patientId={referral.patient.id} refreshTrigger={refreshTrigger} />

      <ReferralTagging 
        referral={referral}
        onTagsUpdated={handleTagsUpdated}
      />

      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Triage History
            </div>
            <TriageHistoryButton onClick={() => setIsTriageHistoryOpen(true)} />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm text-muted-foreground">
            Click "View Triage History" to see complete audit trail and clinical notes
          </div>
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

      {/* Triage History Sheet */}
      <TriageHistorySheet
        referralId={referral.id}
        auditLog={referral.auditLog}
        isOpen={isTriageHistoryOpen}
        onOpenChange={setIsTriageHistoryOpen}
      />
    </div>
  );
};

export default WaitingListViewWorkspace;
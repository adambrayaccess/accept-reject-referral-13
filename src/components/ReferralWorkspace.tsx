
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Referral } from '@/types/referral';
import ReferralActions from './ReferralActions';
import CollaborationNotes from './collaboration/CollaborationNotes';
import AuditLog from './audit/AuditLog';
import CreateSubReferralDialog from './sub-referrals/CreateSubReferralDialog';
import SubReferralsList from './sub-referrals/SubReferralsList';
import ParentReferralInfo from './sub-referrals/ParentReferralInfo';
import PatientActivityTimeline from './PatientActivityTimeline';
import ReferralTagging from './referral-tagging/ReferralTagging';
import AISuggestionsPanel from './ai-suggestions/AISuggestionsPanel';

interface ReferralWorkspaceProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ReferralWorkspace = ({ referral, onStatusChange }: ReferralWorkspaceProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log('ReferralWorkspace - Referral status:', referral.status);
    console.log('ReferralWorkspace - Should show AI suggestions:', referral.status === 'accepted');
    console.log('ReferralWorkspace - Full referral data:', referral);
  }, [referral]);

  const handleSubReferralCreated = () => {
    setRefreshKey(prev => prev + 1);
    onStatusChange();
  };

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

      {/* AI Suggestions Panel - Show for accepted referrals */}
      {referral.status === 'accepted' && (
        <div>
          <div className="text-xs text-blue-600 mb-2">DEBUG: AI Suggestions should appear here</div>
          <AISuggestionsPanel 
            referral={referral}
            onSuggestionApplied={handleAISuggestionApplied}
          />
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Triage Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <ReferralActions referral={referral} onStatusChange={onStatusChange} />
            
            {referral.status === 'accepted' && !referral.isSubReferral && (
              <div className="pt-2 border-t">
                <CreateSubReferralDialog 
                  parentReferralId={referral.id}
                  onSubReferralCreated={handleSubReferralCreated}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {referral.status === 'accepted' && !referral.isSubReferral && (
        <SubReferralsList 
          parentReferralId={referral.id}
          onRefresh={refreshKey}
        />
      )}

      <ReferralTagging 
        referral={referral}
        onTagsUpdated={handleTagsUpdated}
      />

      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Triage Workspace</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <AuditLog entries={referral.auditLog} />
          <CollaborationNotes notes={referral.collaborationNotes} />
        </CardContent>
      </Card>

      <PatientActivityTimeline />
    </div>
  );
};

export default ReferralWorkspace;

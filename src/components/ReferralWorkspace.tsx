
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Referral } from '@/types/referral';
import ReferralActions from './ReferralActions';
import TriageStatusUpdate from './triage/TriageStatusUpdate';
import CollaborationNotes from './collaboration/CollaborationNotes';
import AuditLog from './audit/AuditLog';
import CreateSubReferralDialog from './sub-referrals/CreateSubReferralDialog';
import SubReferralsList from './sub-referrals/SubReferralsList';
import ParentReferralInfo from './sub-referrals/ParentReferralInfo';
import PatientActivityTimeline from './PatientActivityTimeline';

interface ReferralWorkspaceProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ReferralWorkspace = ({ referral, onStatusChange }: ReferralWorkspaceProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubReferralCreated = () => {
    setRefreshKey(prev => prev + 1);
    onStatusChange(); // Also refresh the main referral data
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Show parent referral info if this is a sub-referral */}
      {referral.isSubReferral && referral.parentReferralId && (
        <ParentReferralInfo childReferralId={referral.id} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Triage Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ReferralActions referral={referral} onStatusChange={onStatusChange} />
            
            {referral.status === 'accepted' && (
              <>
                <TriageStatusUpdate 
                  referralId={referral.id}
                  currentStatus={referral.triageStatus}
                  onStatusChange={onStatusChange}
                />
                
                {/* Only show sub-referral creation for non-sub-referrals */}
                {!referral.isSubReferral && (
                  <div className="pt-2 border-t">
                    <CreateSubReferralDialog 
                      parentReferralId={referral.id}
                      onSubReferralCreated={handleSubReferralCreated}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient Activity Timeline */}
      <PatientActivityTimeline />

      {/* Show sub-referrals list if this is a parent referral with accepted status */}
      {referral.status === 'accepted' && !referral.isSubReferral && (
        <SubReferralsList 
          parentReferralId={referral.id}
          onRefresh={refreshKey}
        />
      )}

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Triage Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuditLog entries={referral.auditLog} />
          <CollaborationNotes notes={referral.collaborationNotes} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralWorkspace;

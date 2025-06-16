
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

interface ReferralWorkspaceProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ReferralWorkspace = ({ referral, onStatusChange }: ReferralWorkspaceProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubReferralCreated = () => {
    setRefreshKey(prev => prev + 1);
    onStatusChange();
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {referral.isSubReferral && referral.parentReferralId && (
        <ParentReferralInfo childReferralId={referral.id} />
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

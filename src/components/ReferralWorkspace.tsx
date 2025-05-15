
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Referral } from '@/types/referral';
import ReferralActions from './ReferralActions';
import TriageStatusUpdate from './triage/TriageStatusUpdate';
import CollaborationNotes from './collaboration/CollaborationNotes';
import AuditLog from './audit/AuditLog';

interface ReferralWorkspaceProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ReferralWorkspace = ({ referral, onStatusChange }: ReferralWorkspaceProps) => {
  return (
    <div className="flex flex-col h-full gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Triage Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ReferralActions referral={referral} onStatusChange={onStatusChange} />
            
            {referral.status === 'accepted' && (
              <TriageStatusUpdate 
                referralId={referral.id}
                currentStatus={referral.triageStatus}
                onStatusChange={onStatusChange}
              />
            )}
          </div>
        </CardContent>
      </Card>

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

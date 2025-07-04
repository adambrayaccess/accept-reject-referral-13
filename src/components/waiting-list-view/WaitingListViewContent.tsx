import { ScrollArea } from '@/components/ui/scroll-area';
import { Referral } from '@/types/referral';
import ReferralDetail from '@/components/ReferralDetail';
import MedicalHistory from '@/components/MedicalHistory';
import ReferralDocuments from '@/components/ReferralDocuments';
import ParentReferralInfo from '@/components/sub-referrals/ParentReferralInfo';
import WaitingListViewWorkspace from './WaitingListViewWorkspace';

interface WaitingListViewContentProps {
  referral: Referral;
  relatedReferrals: {
    serviceTotal: number;
    activeTotal: number;
    activeSpecialties: string[];
  };
  onStatusChange: () => void;
  onDocumentUploaded: () => void;
  onSuggestionApplied?: () => void;
}

const WaitingListViewContent = ({ 
  referral, 
  relatedReferrals, 
  onStatusChange, 
  onDocumentUploaded,
  onSuggestionApplied
}: WaitingListViewContentProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
      {/* Left column - Main content (60% width) */}
      <div className="flex-1 md:flex-none md:basis-[60%] h-full min-h-0">
        <ScrollArea className="h-full w-full">
          <div className="space-y-6 p-4 pb-8">
            <ReferralDetail 
              referral={referral} 
              relatedReferrals={relatedReferrals}
            />
            {referral.isSubReferral && referral.parentReferralId && (
              <ParentReferralInfo childReferralId={referral.id} />
            )}
            <MedicalHistory patient={referral.patient} />
            <ReferralDocuments 
              attachments={referral.attachments} 
              referralId={referral.id}
              patientName={referral.patient.name}
              onDocumentUploaded={onDocumentUploaded}
            />
          </div>
        </ScrollArea>
      </div>
      
      {/* Right column - Workspace (40% width) */}
      <div className="flex-1 md:flex-none md:basis-[40%] h-full min-h-0">
        <ScrollArea className="h-full w-full">
          <div className="space-y-3 p-4 pb-8">
            <WaitingListViewWorkspace 
              referral={referral}
              onStatusChange={onStatusChange}
              onSuggestionApplied={onSuggestionApplied}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default WaitingListViewContent;
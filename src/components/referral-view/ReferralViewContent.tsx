
import { ScrollArea } from '@/components/ui/scroll-area';
import { Referral } from '@/types/referral';
import ReferralDetail from '@/components/ReferralDetail';
import MedicalHistory from '@/components/MedicalHistory';
import ReferralDocuments from '@/components/ReferralDocuments';
import ReferralWorkspace from '@/components/ReferralWorkspace';

interface ReferralViewContentProps {
  referral: Referral;
  relatedReferrals: {
    serviceTotal: number;
    activeTotal: number;
    activeSpecialties: string[];
  };
  onStatusChange: () => void;
  onDocumentUploaded: () => void;
}

const ReferralViewContent = ({ 
  referral, 
  relatedReferrals, 
  onStatusChange, 
  onDocumentUploaded 
}: ReferralViewContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
      {/* Left column - Main content (2/3 width) */}
      <div className="md:col-span-2 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pr-4 space-y-6">
            <ReferralDetail 
              referral={referral} 
              relatedReferrals={relatedReferrals}
            />
            <MedicalHistory patient={referral.patient} />
            <ReferralDocuments 
              attachments={referral.attachments} 
              referralId={referral.id}
              onDocumentUploaded={onDocumentUploaded}
            />
          </div>
        </ScrollArea>
      </div>
      
      {/* Right column - Workspace (1/3 width) */}
      <div className="md:col-span-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pr-4">
            <ReferralWorkspace 
              referral={referral}
              onStatusChange={onStatusChange}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ReferralViewContent;

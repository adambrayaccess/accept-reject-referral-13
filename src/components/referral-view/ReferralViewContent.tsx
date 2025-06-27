
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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-full">
      {/* Left column - Main content (60% width) */}
      <div className="md:col-span-3 h-full">
        <ScrollArea className="h-full w-full">
          <div className="space-y-6 pr-4 pb-6">
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
      
      {/* Right column - Workspace (40% width) */}
      <div className="md:col-span-2 h-full">
        <ScrollArea className="h-full w-full">
          <div className="space-y-3 pr-4 pb-6">
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

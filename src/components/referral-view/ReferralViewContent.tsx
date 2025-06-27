
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
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
      {/* Left column - Main content (60% width) */}
      <div className="flex-1 md:w-[60%] h-full min-h-0 border border-blue-200 bg-blue-50/20">
        <ScrollArea className="h-full w-full">
          <div className="space-y-6 p-4 pb-8">
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
      <div className="flex-1 md:w-[40%] h-full min-h-0 border border-green-200 bg-green-50/20">
        <ScrollArea className="h-full w-full">
          <div className="space-y-3 p-4 pb-8">
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


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
    <div className="grid grid-cols-1 xl:grid-cols-[1fr,500px] gap-4 h-[calc(100vh-200px)]">
      <div className="overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pr-3 space-y-4">
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
      
      <div className="overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pr-3">
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

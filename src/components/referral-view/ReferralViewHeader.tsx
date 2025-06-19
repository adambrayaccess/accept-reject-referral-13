
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Referral } from '@/types/referral';
import TriageStatusBadge from '@/components/triage/TriageStatusBadge';
import ReferralTagsDisplay from '@/components/referral-tagging/ReferralTagsDisplay';
import AllergyIndicator from '@/components/clinical/AllergyIndicator';

interface ReferralViewHeaderProps {
  referral: Referral;
  onBack: () => void;
}

const ReferralViewHeader = ({ referral, onBack }: ReferralViewHeaderProps) => {
  console.log('ReferralViewHeader - Full referral data:', referral);
  console.log('ReferralViewHeader - Patient data:', referral.patient);
  console.log('ReferralViewHeader - Medical history:', referral.patient.medicalHistory);
  console.log('ReferralViewHeader - Allergies from medicalHistory:', referral.patient.medicalHistory?.allergies);
  
  return (
    <>
      <Button variant="ghost" onClick={onBack} className="mb-3">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{referral.patient.name}</h1>
            <AllergyIndicator allergies={referral.patient.medicalHistory?.allergies} />
            {referral.isSubReferral && (
              <Badge variant="outline" className="text-xs">Sub-referral</Badge>
            )}
            {referral.status === 'accepted' && (
              <TriageStatusBadge status={referral.triageStatus} />
            )}
          </div>
          <p className="text-muted-foreground">
            NHS: <span className="font-mono">{referral.patient.nhsNumber}</span>
          </p>
          {referral.tags && referral.tags.length > 0 && (
            <ReferralTagsDisplay tags={referral.tags} maxVisible={5} />
          )}
        </div>
      </div>
    </>
  );
};

export default ReferralViewHeader;

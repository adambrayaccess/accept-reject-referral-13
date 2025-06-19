
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Referral } from '@/types/referral';
import TriageStatusBadge from '@/components/triage/TriageStatusBadge';
import ReferralTagsDisplay from '@/components/referral-tagging/ReferralTagsDisplay';
import AllergyIndicator from '@/components/clinical/AllergyIndicator';
import ReasonableAdjustmentsFlag from '@/components/clinical/ReasonableAdjustmentsFlag';

interface ReferralViewHeaderProps {
  referral: Referral;
  onBack: () => void;
}

const ReferralViewHeader = ({ referral, onBack }: ReferralViewHeaderProps) => {
  // Enhanced data validation logging specifically for NEUR-2024-003
  console.log('=== ReferralViewHeader Data Validation ===');
  console.log('Referral ID:', referral.id);
  console.log('Patient ID:', referral.patient?.id);
  console.log('Patient name:', referral.patient?.name);
  console.log('Is this NEUR-2024-003?', referral.id === 'NEUR-2024-003');
  console.log('Patient reasonable adjustments prop:', referral.patient?.reasonableAdjustments);
  
  if (referral.id === 'NEUR-2024-003') {
    console.log('🔍 DEBUGGING NEUR-2024-003 specifically:');
    console.log('- Patient object type:', typeof referral.patient);
    console.log('- Patient keys:', Object.keys(referral.patient || {}));
    console.log('- ReasonableAdjustments value:', referral.patient?.reasonableAdjustments);
    console.log('- Type of reasonableAdjustments:', typeof referral.patient?.reasonableAdjustments);
    
    if (referral.patient?.reasonableAdjustments) {
      console.log('✅ Adjustments data found:');
      console.log('  - hasAdjustments:', referral.patient.reasonableAdjustments.hasAdjustments);
      console.log('  - flagLevel:', referral.patient.reasonableAdjustments.flagLevel);
      console.log('  - adjustments array:', referral.patient.reasonableAdjustments.adjustments);
    } else {
      console.log('❌ No adjustments data - this is the bug!');
    }
  }
  console.log('==========================================');
  
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
            <ReasonableAdjustmentsFlag adjustmentsFlag={referral.patient.reasonableAdjustments} />
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

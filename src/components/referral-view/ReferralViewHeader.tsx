
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Referral } from '@/types/referral';
import TriageStatusBadge from '@/components/triage/TriageStatusBadge';
import ReferralTagsDisplay from '@/components/referral-tagging/ReferralTagsDisplay';
import AllergyIndicator from '@/components/clinical/AllergyIndicator';
import ReasonableAdjustmentsFlag from '@/components/clinical/ReasonableAdjustmentsFlag';
import AICopilotButton from '@/components/ai-suggestions/AICopilotButton';
import ClinicalTagsPopover from '@/components/referral-tagging/ClinicalTagsPopover';

interface ReferralViewHeaderProps {
  referral: Referral;
  onBack: () => void;
  onSuggestionApplied?: () => void;
}

const ReferralViewHeader = ({ referral, onBack, onSuggestionApplied }: ReferralViewHeaderProps) => {
  
  return (
    <>
      <Button variant="ghost" onClick={onBack} className="mb-3 ml-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4 pl-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{referral.patient.name}</h1>
            <AllergyIndicator allergies={referral.patient.allergies} />
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
        
        <div className="flex items-center gap-2">
          <ClinicalTagsPopover 
            referral={referral}
            onTagsUpdated={onSuggestionApplied || (() => {})}
          />
          <AICopilotButton 
            referral={referral} 
            onSuggestionApplied={onSuggestionApplied || (() => {})}
          />
        </div>
      </div>
    </>
  );
};

export default ReferralViewHeader;

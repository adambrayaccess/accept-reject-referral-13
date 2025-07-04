
import InlineSpecialtySelector from '../InlineSpecialtySelector';
import { useSpecialtyData } from '@/hooks/useSpecialtyData';
import { useToast } from '@/hooks/use-toast';
import CohortAICopilotButton from './CohortAICopilotButton';
import { Referral } from '@/types/referral';

interface CohortBuilderHeaderProps {
  selectedSpecialties: string[];
  onSpecialtyChange?: (specialties: string[]) => void;
  selectedReferrals: Referral[];
  onAISuggestionApplied: () => void;
}

const CohortBuilderHeader = ({ 
  selectedSpecialties, 
  onSpecialtyChange, 
  selectedReferrals, 
  onAISuggestionApplied 
}: CohortBuilderHeaderProps) => {
  const { toast } = useToast();
  // Use database specialty data
  const { getSpecialtyNames } = useSpecialtyData();
  const specialtyNames = getSpecialtyNames();

  const handleSpecialtySelectionChange = (newSelection: string[]) => {
    if (onSpecialtyChange) {
      onSpecialtyChange(newSelection);
    }
    
    if (newSelection.length > 0) {
      localStorage.setItem('selectedSpecialties', JSON.stringify(newSelection));
      toast({
        title: "Services Updated",
        description: `Now managing waiting list for ${newSelection.length === 1 ? newSelection[0] : `${newSelection.length} services`}`,
      });
    } else {
      localStorage.removeItem('selectedSpecialties');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Waiting List Manager</h1>
        <div className="flex items-center mt-1">
          <span className="text-sm text-muted-foreground mr-2">Managing waiting list for:</span>
          <InlineSpecialtySelector
            specialties={specialtyNames}
            selectedSpecialties={selectedSpecialties}
            onSelectionChange={handleSpecialtySelectionChange}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <CohortAICopilotButton 
          selectedReferrals={selectedReferrals}
          onSuggestionApplied={onAISuggestionApplied}
        />
      </div>
    </div>
  );
};

export default CohortBuilderHeader;

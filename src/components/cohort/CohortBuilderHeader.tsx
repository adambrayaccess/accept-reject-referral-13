
import InlineSpecialtySelector from '../InlineSpecialtySelector';
import { getAllSpecialtyNames } from '@/data/specialtyOptions';
import { useToast } from '@/hooks/use-toast';

interface CohortBuilderHeaderProps {
  selectedSpecialties: string[];
  onSpecialtyChange?: (specialties: string[]) => void;
}

const CohortBuilderHeader = ({ selectedSpecialties, onSpecialtyChange }: CohortBuilderHeaderProps) => {
  const { toast } = useToast();
  // Use centralized specialty data
  const specialtyNames = getAllSpecialtyNames();

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
  );
};

export default CohortBuilderHeader;

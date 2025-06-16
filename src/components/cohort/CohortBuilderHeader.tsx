
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CohortBuilderHeaderProps {
  selectedSpecialties: string[];
  onBack: () => void;
}

const CohortBuilderHeader = ({ selectedSpecialties, onBack }: CohortBuilderHeaderProps) => {
  const getDisplayText = () => {
    if (selectedSpecialties.length === 0) {
      return 'No specialties selected';
    } else if (selectedSpecialties.length === 1) {
      return selectedSpecialties[0];
    } else {
      return `${selectedSpecialties.length} specialties: ${selectedSpecialties.join(', ')}`;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Waiting List Manager</h1>
        <p className="text-muted-foreground">
          Managing waiting list for: <span className="font-medium text-foreground">{getDisplayText()}</span>
        </p>
      </div>
    </>
  );
};

export default CohortBuilderHeader;

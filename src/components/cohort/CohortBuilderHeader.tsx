
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CohortBuilderHeaderProps {
  currentSpecialty: string | null;
  onBack: () => void;
}

const CohortBuilderHeader = ({ currentSpecialty, onBack }: CohortBuilderHeaderProps) => {
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
        {currentSpecialty && (
          <p className="text-muted-foreground">
            Managing waiting list for: <span className="font-medium text-foreground">{currentSpecialty}</span>
          </p>
        )}
      </div>
    </>
  );
};

export default CohortBuilderHeader;

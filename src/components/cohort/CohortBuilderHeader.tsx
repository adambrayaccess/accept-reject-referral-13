
import InlineServiceSelector from '../InlineServiceSelector';
import { getAllServiceNames } from '@/data/serviceOptions';
import { useToast } from '@/hooks/use-toast';

interface CohortBuilderHeaderProps {
  selectedServices: string[];
  onServiceChange?: (services: string[]) => void;
}

const CohortBuilderHeader = ({ selectedServices, onServiceChange }: CohortBuilderHeaderProps) => {
  const { toast } = useToast();
  // Use centralized service data
  const serviceNames = getAllServiceNames();

  const handleServiceSelectionChange = (newSelection: string[]) => {
    if (onServiceChange) {
      onServiceChange(newSelection);
    }
    
    if (newSelection.length > 0) {
      localStorage.setItem('selectedServices', JSON.stringify(newSelection));
      toast({
        title: "Services Updated",
        description: `Now managing waiting list for ${newSelection.length === 1 ? newSelection[0] : `${newSelection.length} services`}`,
      });
    } else {
      localStorage.removeItem('selectedServices');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Waiting List Manager</h1>
      <div className="flex items-center mt-1">
        <span className="text-sm text-muted-foreground mr-2">Managing waiting list for:</span>
        <InlineServiceSelector
          services={serviceNames}
          selectedServices={selectedServices}
          onSelectionChange={handleServiceSelectionChange}
        />
      </div>
    </div>
  );
};

export default CohortBuilderHeader;

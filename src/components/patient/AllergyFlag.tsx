
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Allergy } from '@/types/medical';

interface AllergyFlagProps {
  allergies?: Allergy[];
}

const AllergyFlag = ({ allergies }: AllergyFlagProps) => {
  const activeAllergies = allergies?.filter(allergy => allergy.status === 'active') || [];
  
  if (activeAllergies.length === 0) {
    return null;
  }

  const hasSevereAllergies = activeAllergies.some(
    allergy => allergy.severity === 'severe' || allergy.severity === 'life-threatening'
  );

  const allergyList = activeAllergies.map(allergy => allergy.allergen).join(', ');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={hasSevereAllergies ? "destructive" : "secondary"} 
            className="flex items-center gap-1 text-xs"
          >
            <AlertTriangle className="h-3 w-3" />
            Allergies ({activeAllergies.length})
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-semibold mb-1">Known Allergies:</p>
            <p className="text-sm">{allergyList}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AllergyFlag;

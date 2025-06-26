
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface InlineSpecialtySelectorProps {
  specialties: string[];
  selectedSpecialties: string[];
  onSelectionChange: (selectedSpecialties: string[]) => void;
}

const InlineSpecialtySelector = ({
  specialties,
  selectedSpecialties,
  onSelectionChange,
}: InlineSpecialtySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSpecialtyToggle = (specialty: string) => {
    const newSelection = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty];
    
    onSelectionChange(newSelection);
  };

  const removeSpecialty = (specialty: string) => {
    const newSelection = selectedSpecialties.filter(s => s !== specialty);
    onSelectionChange(newSelection);
  };

  const getDisplayText = () => {
    if (selectedSpecialties.length === 0) return 'No specialties selected';
    if (selectedSpecialties.length === 1) return selectedSpecialties[0];
    return `${selectedSpecialties.length} specialties selected`;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
          >
            {getDisplayText()}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Select Specialties</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {specialties.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty}
                    checked={selectedSpecialties.includes(specialty)}
                    onCheckedChange={() => handleSpecialtyToggle(specialty)}
                  />
                  <label
                    htmlFor={specialty}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {specialty}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {selectedSpecialties.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap max-w-2xl">
          {selectedSpecialties.slice(0, 3).map((specialty) => (
            <Badge 
              key={specialty} 
              variant="secondary" 
              className="text-xs px-2 py-0.5 flex items-center gap-1"
            >
              {specialty}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeSpecialty(specialty)}
              />
            </Badge>
          ))}
          {selectedSpecialties.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{selectedSpecialties.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default InlineSpecialtySelector;

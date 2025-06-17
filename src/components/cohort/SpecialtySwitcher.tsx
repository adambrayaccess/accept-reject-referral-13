
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Stethoscope } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

interface SpecialtySwitcherProps {
  selectedSpecialties: string[];
  onSpecialtyChange: (specialties: string[]) => void;
}

const availableSpecialties = [
  'Cardiology',
  'Dermatology', 
  'Gastroenterology',
  'Mental Health',
  'Neurology',
  'Rheumatology'
];

const SpecialtySwitcher = ({ selectedSpecialties, onSpecialtyChange }: SpecialtySwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSpecialtyToggle = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      onSpecialtyChange(selectedSpecialties.filter(s => s !== specialty));
    } else {
      onSpecialtyChange([...selectedSpecialties, specialty]);
    }
  };

  const handleSelectAll = () => {
    onSpecialtyChange(availableSpecialties);
  };

  const handleClearAll = () => {
    onSpecialtyChange([]);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Viewing:</span>
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 h-8">
            {selectedSpecialties.length === 0 ? (
              'No specialties selected'
            ) : selectedSpecialties.length === 1 ? (
              selectedSpecialties[0]
            ) : (
              `${selectedSpecialties.length} specialties`
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-64 p-0" align="start">
          <Card className="border-0 shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-sm">Select Specialties</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="h-6 px-2 text-xs"
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-6 px-2 text-xs"
                  >
                    None
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                {availableSpecialties.map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={selectedSpecialties.includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <label 
                      htmlFor={specialty}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {specialty}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
      
      {selectedSpecialties.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedSpecialties.slice(0, 3).map(specialty => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {selectedSpecialties.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{selectedSpecialties.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecialtySwitcher;


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

interface SpecialtyMultiSelectorProps {
  specialties: string[];
  selectedSpecialties: string[];
  onSelectionChange: (specialties: string[]) => void;
  placeholder?: string;
  className?: string;
}

const SpecialtyMultiSelector = ({ 
  specialties, 
  selectedSpecialties, 
  onSelectionChange,
  placeholder = "Select specialties",
  className = ""
}: SpecialtyMultiSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredSpecialties = specialties.filter(specialty => specialty !== 'all');
  const isAllSelected = selectedSpecialties.length === filteredSpecialties.length;
  const hasSelections = selectedSpecialties.length > 0;

  const handleToggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      onSelectionChange(selectedSpecialties.filter(s => s !== specialty));
    } else {
      onSelectionChange([...selectedSpecialties, specialty]);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...filteredSpecialties]);
    }
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    onSelectionChange(selectedSpecialties.filter(s => s !== specialtyToRemove));
  };

  const getDisplayText = () => {
    if (selectedSpecialties.length === 0) {
      return placeholder;
    } else if (selectedSpecialties.length === 1) {
      return selectedSpecialties[0];
    } else if (isAllSelected) {
      return 'All Specialties';
    } else {
      return `${selectedSpecialties.length} specialties selected`;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between text-left font-normal"
          >
            <span className="truncate">{getDisplayText()}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-white border shadow-lg z-50">
          <DropdownMenuItem 
            onClick={handleSelectAll}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Checkbox 
              checked={isAllSelected}
              onChange={() => {}} // Handled by onClick
            />
            <span className="font-medium">
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {filteredSpecialties.map((specialty) => (
            <DropdownMenuItem
              key={specialty}
              onClick={() => handleToggleSpecialty(specialty)}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox 
                checked={selectedSpecialties.includes(specialty)}
                onChange={() => {}} // Handled by onClick
              />
              <span>{specialty}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasSelections && (
        <div className="flex flex-wrap gap-1">
          {selectedSpecialties.map((specialty) => (
            <Badge 
              key={specialty} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              {specialty}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 hover:bg-transparent"
                onClick={() => handleRemoveSpecialty(specialty)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialtyMultiSelector;

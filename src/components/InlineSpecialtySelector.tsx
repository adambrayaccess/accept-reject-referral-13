
import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

interface InlineSpecialtySelectorProps {
  specialties: string[];
  selectedSpecialties: string[];
  onSelectionChange: (specialties: string[]) => void;
}

const InlineSpecialtySelector = ({ 
  specialties, 
  selectedSpecialties, 
  onSelectionChange
}: InlineSpecialtySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredSpecialties = specialties.filter(specialty => specialty !== 'all');
  const isAllSelected = selectedSpecialties.length === filteredSpecialties.length;

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

  const getDisplayText = () => {
    if (selectedSpecialties.length === 0) {
      return 'No specialties selected';
    } else {
      return selectedSpecialties.join(', ');
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors cursor-pointer group">
        <span>{getDisplayText()}</span>
        <ChevronDown className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white border shadow-lg z-50" align="start">
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
  );
};

export default InlineSpecialtySelector;


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown, Check } from 'lucide-react';
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
  const [pendingSelection, setPendingSelection] = useState<string[]>([]);

  // Initialize pending selection when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setPendingSelection([...selectedSpecialties]);
    }
  }, [isOpen, selectedSpecialties]);

  const filteredSpecialties = specialties.filter(specialty => specialty !== 'all');
  const isAllSelected = pendingSelection.length === filteredSpecialties.length;
  const hasSelections = selectedSpecialties.length > 0;
  const hasPendingChanges = JSON.stringify(pendingSelection.sort()) !== JSON.stringify(selectedSpecialties.sort());

  const handleToggleSpecialty = (specialty: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (pendingSelection.includes(specialty)) {
      setPendingSelection(pendingSelection.filter(s => s !== specialty));
    } else {
      setPendingSelection([...pendingSelection, specialty]);
    }
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAllSelected) {
      setPendingSelection([]);
    } else {
      setPendingSelection([...filteredSpecialties]);
    }
  };

  const handleApply = () => {
    onSelectionChange(pendingSelection);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setPendingSelection([...selectedSpecialties]);
    setIsOpen(false);
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    onSelectionChange(selectedSpecialties.filter(s => s !== specialtyToRemove));
  };

  const getDisplayText = () => {
    if (selectedSpecialties.length === 0) {
      return placeholder;
    } else if (selectedSpecialties.length === 1) {
      return selectedSpecialties[0];
    } else if (selectedSpecialties.length === filteredSpecialties.length) {
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
        <DropdownMenuContent 
          className="w-80 bg-white border shadow-lg z-50" 
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuItem 
            onClick={handleSelectAll}
            onSelect={(e) => e.preventDefault()}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Checkbox 
              checked={isAllSelected}
              onChange={() => {}}
            />
            <span className="font-medium">
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          <div className="max-h-48 overflow-y-auto">
            {filteredSpecialties.map((specialty) => (
              <DropdownMenuItem
                key={specialty}
                onClick={(e) => handleToggleSpecialty(specialty, e)}
                onSelect={(e) => e.preventDefault()}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Checkbox 
                  checked={pendingSelection.includes(specialty)}
                  onChange={() => {}}
                />
                <span className="flex-1">{specialty}</span>
                {pendingSelection.includes(specialty) && !selectedSpecialties.includes(specialty) && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                    New
                  </Badge>
                )}
                {!pendingSelection.includes(specialty) && selectedSpecialties.includes(specialty) && (
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                    Remove
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          <div className="flex gap-2 p-2">
            <Button 
              size="sm" 
              onClick={handleApply}
              disabled={!hasPendingChanges}
              className="flex-1"
            >
              <Check className="h-3 w-3 mr-1" />
              Apply ({pendingSelection.length})
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
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


import { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InlineServiceSelectorProps {
  services: string[];
  selectedServices: string[];
  onSelectionChange: (services: string[]) => void;
}

const InlineServiceSelector = ({ 
  services, 
  selectedServices, 
  onSelectionChange
}: InlineServiceSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<string[]>([]);

  // Initialize pending selection when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setPendingSelection([...selectedServices]);
    }
  }, [isOpen, selectedServices]);

  const filteredServices = services.filter(service => service !== 'all');
  const isAllSelected = pendingSelection.length === filteredServices.length;
  const hasPendingChanges = JSON.stringify(pendingSelection.sort()) !== JSON.stringify(selectedServices.sort());

  const handleToggleService = (service: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (pendingSelection.includes(service)) {
      setPendingSelection(pendingSelection.filter(s => s !== service));
    } else {
      setPendingSelection([...pendingSelection, service]);
    }
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAllSelected) {
      setPendingSelection([]);
    } else {
      setPendingSelection([...filteredServices]);
    }
  };

  const handleApply = () => {
    onSelectionChange(pendingSelection);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setPendingSelection([...selectedServices]);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedServices.length === 0) {
      return 'No services selected';
    } else if (selectedServices.length === filteredServices.length) {
      return 'All services';
    } else {
      return selectedServices.join(', ');
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors cursor-pointer group">
        <span>{getDisplayText()}</span>
        <ChevronDown className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        {hasPendingChanges && isOpen && (
          <Badge variant="outline" className="ml-1 text-xs bg-blue-50 text-blue-600 border-blue-200">
            {pendingSelection.length} pending
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-white border shadow-lg z-50" 
        align="start"
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
          {filteredServices.map((service) => (
            <DropdownMenuItem
              key={service}
              onClick={(e) => handleToggleService(service, e)}
              onSelect={(e) => e.preventDefault()}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox 
                checked={pendingSelection.includes(service)}
                onChange={() => {}}
              />
              <span className="flex-1">{service}</span>
              {pendingSelection.includes(service) && !selectedServices.includes(service) && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                  New
                </Badge>
              )}
              {!pendingSelection.includes(service) && selectedServices.includes(service) && (
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
  );
};

export default InlineServiceSelector;

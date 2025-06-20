
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

interface ServiceMultiSelectorProps {
  services: string[];
  selectedServices: string[];
  onSelectionChange: (services: string[]) => void;
  placeholder?: string;
  className?: string;
}

const ServiceMultiSelector = ({ 
  services, 
  selectedServices, 
  onSelectionChange,
  placeholder = "Select services",
  className = ""
}: ServiceMultiSelectorProps) => {
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
  const hasSelections = selectedServices.length > 0;
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

  const handleRemoveService = (serviceToRemove: string) => {
    onSelectionChange(selectedServices.filter(s => s !== serviceToRemove));
  };

  const getDisplayText = () => {
    if (selectedServices.length === 0) {
      return placeholder;
    } else if (selectedServices.length === 1) {
      return selectedServices[0];
    } else if (selectedServices.length === filteredServices.length) {
      return 'All Services';
    } else {
      return `${selectedServices.length} services selected`;
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

      {hasSelections && (
        <div className="flex flex-wrap gap-1">
          {selectedServices.map((service) => (
            <Badge 
              key={service} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              {service}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 hover:bg-transparent"
                onClick={() => handleRemoveService(service)}
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

export default ServiceMultiSelector;

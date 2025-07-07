
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Patient } from '@/types/referral';
import { searchPatients, PatientSearchResult } from '@/services/patientService';

interface PatientAutocompleteProps {
  value?: Patient;
  onSelect: (patient: Patient | undefined) => void;
  placeholder?: string;
  className?: string;
  onCreateNew?: () => void;
}

const PatientAutocomplete = ({
  value,
  onSelect,
  placeholder = "Search for a patient...",
  className,
  onCreateNew,
}: PatientAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchPatients(searchQuery);
          setSearchResults(results.map(r => r.patient));
        } catch (error) {
          console.error('Error searching patients:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelect = (patient: Patient) => {
    onSelect(patient);
    setOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelect(undefined);
    setSearchQuery('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between min-h-[2.5rem] h-auto", className)}
        >
          {value ? (
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground">{value.name}</div>
              <div className="text-xs text-muted-foreground">NHS: {value.nhsNumber}</div>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border border-border shadow-lg z-[100] max-w-none">
        <Command>
          <CommandInput
            placeholder="Type patient name, NHS number, or phone..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-10"
          />
          <CommandList>
            <CommandEmpty>
              {searchQuery.length < 2 
                ? "Type at least 2 characters to search patients" 
                : isLoading 
                ? "Searching patients..." 
                : "No patients found."
              }
            </CommandEmpty>
            {searchResults.length > 0 && !isLoading && (
              <CommandGroup>
                {searchResults.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.id}
                    onSelect={() => handleSelect(patient)}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mt-0.5">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground mb-1 truncate">
                        {patient.name}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">NHS:</span> {patient.nhsNumber}
                        </div>
                        {patient.phone && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Phone:</span> {patient.phone}
                          </div>
                        )}
                        {patient.address && (
                          <div className="text-sm text-muted-foreground truncate">
                            <span className="font-medium">Address:</span> {patient.address}
                          </div>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4 mt-1 flex-shrink-0",
                        value?.id === patient.id ? "opacity-100 text-primary" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {searchQuery.length >= 2 && searchResults.length === 0 && !isLoading && onCreateNew && (
              <CommandGroup>
                <CommandItem 
                  onSelect={onCreateNew} 
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors border-t"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Create new patient</div>
                    <div className="text-sm text-muted-foreground">No existing patient found with "{searchQuery}"</div>
                  </div>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        {value && (
          <div className="border-t p-3 bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="w-full text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
            >
              Clear selection
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PatientAutocomplete;

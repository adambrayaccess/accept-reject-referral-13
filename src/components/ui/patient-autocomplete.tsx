
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, User } from 'lucide-react';
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
import { searchPatients } from '@/services/patientSearchService';

interface PatientAutocompleteProps {
  value?: Patient;
  onSelect: (patient: Patient | undefined) => void;
  placeholder?: string;
  className?: string;
}

const PatientAutocomplete = ({
  value,
  onSelect,
  placeholder = "Search for a patient...",
  className,
}: PatientAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchPatients(searchQuery);
      setSearchResults(results.map(r => r.patient));
    } else {
      setSearchResults([]);
    }
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
          className={cn("w-full justify-between", className)}
        >
          {value ? (
            <span className="truncate">
              {value.name} - {value.nhsNumber}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white border border-gray-200 shadow-lg z-50">
        <Command>
          <CommandInput
            placeholder="Type patient name, NHS number, or phone..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {searchQuery.length < 2 
                ? "Type at least 2 characters to search" 
                : "No patients found."
              }
            </CommandEmpty>
            {searchResults.length > 0 && (
              <CommandGroup>
                {searchResults.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.id}
                    onSelect={() => handleSelect(patient)}
                    className="flex items-center gap-2 p-2"
                  >
                    <User className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        NHS: {patient.nhsNumber}
                        {patient.phone && ` • Phone: ${patient.phone}`}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value?.id === patient.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        {value && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="w-full text-muted-foreground"
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

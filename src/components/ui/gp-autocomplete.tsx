import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
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
import { GPDetails } from '@/types/patient';
import { fetchGPDetails } from '@/services/gpService';

interface GPAutocompleteProps {
  value?: GPDetails;
  onSelect: (gp: GPDetails | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function GPAutocomplete({
  value,
  onSelect,
  placeholder = "Search for a GP...",
  disabled = false,
}: GPAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gpList, setGpList] = useState<GPDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadGPs = async () => {
      setIsLoading(true);
      try {
        const gps = await fetchGPDetails(searchTerm);
        setGpList(gps);
      } catch (error) {
        console.error('Error loading GPs:', error);
        setGpList([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(loadGPs, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelect = (selectedGP: GPDetails) => {
    onSelect(selectedGP);
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? (
            <span className="truncate">
              {value.name} - {value.practice}
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search GPs..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[200px]">
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground">Loading GPs...</div>
            ) : (
              <>
                <CommandEmpty>No GPs found.</CommandEmpty>
                <CommandGroup>
                  {value && (
                    <CommandItem onSelect={handleClear}>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Clear selection</span>
                      </div>
                    </CommandItem>
                  )}
                  {gpList.map((gp) => (
                    <CommandItem
                      key={gp.id}
                      value={`${gp.name}-${gp.practice}`}
                      onSelect={() => handleSelect(gp)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value?.id === gp.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{gp.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {gp.practice}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {gp.address}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
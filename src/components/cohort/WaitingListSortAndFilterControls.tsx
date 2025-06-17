
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  X,
  Check
} from 'lucide-react';

interface WaitingListSortAndFilterControlsProps {
  filters: any;
  updateFilters: (updates: any) => void;
  clearFilters: () => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const WaitingListSortAndFilterControls = ({
  filters,
  updateFilters,
  clearFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}: WaitingListSortAndFilterControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortOptions = [
    { value: 'created', label: 'Date Added' },
    { value: 'patient.name', label: 'Patient Name' },
    { value: 'priority', label: 'Priority' },
    { value: 'calculatedReferralAge', label: 'Days Waiting' },
    { value: 'calculatedPatientAge', label: 'Patient Age' },
    { value: 'calculatedLocation', label: 'Location' },
    { value: 'referrer.organization', label: 'Referrer' }
  ];

  const availablePriorities = ['routine', 'urgent', 'emergency'];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priority !== 'all') count++;
    if (filters.location) count++;
    if (filters.ageRange?.min > 0 || filters.ageRange?.max < 365) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const handleReset = () => {
    clearFilters();
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const togglePriority = (priority: string) => {
    updateFilters({ priority: filters.priority === priority ? 'all' : priority });
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={sortField} onValueChange={setSortField}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
      >
        {sortDirection === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Waiting List Filters</h3>
              <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
            </div>

            <Accordion type="multiple" defaultValue={['priority']}>
              <AccordionItem value="priority">
                <AccordionTrigger className="py-2">
                  <span>Priority</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {availablePriorities.map(priority => (
                      <Button 
                        key={priority} 
                        variant={filters.priority === priority ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => togglePriority(priority)}
                        className="w-full justify-start capitalize"
                      >
                        {filters.priority === priority && (
                          <Check className="mr-2 h-3 w-3" />
                        )}
                        {priority}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="location">
                <AccordionTrigger className="py-2">
                  <span>Location</span>
                </AccordionTrigger>
                <AccordionContent>
                  <Input
                    placeholder="Enter location..."
                    value={filters.location || ''}
                    onChange={(e) => updateFilters({ location: e.target.value })}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="age">
                <AccordionTrigger className="py-2">
                  <span>Days Waiting</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.ageRange?.min || ''}
                        onChange={(e) => updateFilters({
                          ageRange: {
                            ...filters.ageRange,
                            min: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.ageRange?.max === 365 ? '' : filters.ageRange?.max || ''}
                        onChange={(e) => updateFilters({
                          ageRange: {
                            ...filters.ageRange,
                            max: parseInt(e.target.value) || 365
                          }
                        })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end">
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default WaitingListSortAndFilterControls;

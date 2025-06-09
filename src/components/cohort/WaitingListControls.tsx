
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  X
} from 'lucide-react';

interface WaitingListControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortField: string;
  onSortFieldChange: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  locationFilter: string;
  onLocationFilterChange: (location: string) => void;
  ageFilter: { min: number; max: number };
  onAgeFilterChange: (ageFilter: { min: number; max: number }) => void;
  onClearFilters: () => void;
}

const WaitingListControls = ({
  searchTerm,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionChange,
  priorityFilter,
  onPriorityFilterChange,
  locationFilter,
  onLocationFilterChange,
  ageFilter,
  onAgeFilterChange,
  onClearFilters
}: WaitingListControlsProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (priorityFilter !== 'all') count++;
    if (locationFilter) count++;
    if (ageFilter.min > 0 || ageFilter.max < 365) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const sortOptions = [
    { value: 'created', label: 'Date Added' },
    { value: 'patient.name', label: 'Patient Name' },
    { value: 'priority', label: 'Priority' },
    { value: 'calculatedReferralAge', label: 'Days Waiting' },
    { value: 'calculatedPatientAge', label: 'Patient Age' },
    { value: 'calculatedLocation', label: 'Location' },
    { value: 'referrer.organization', label: 'Referrer' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient name, NHS number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Select value={sortField} onValueChange={onSortFieldChange}>
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
            onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel className="flex items-center justify-between">
                Filters
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-auto p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <div className="p-2 space-y-4">
                <div>
                  <label className="text-xs font-medium mb-2 block">Priority</label>
                  <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => onLocationFilterChange(e.target.value)}
                    className="h-8"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-2 block">Days Waiting</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={ageFilter.min || ''}
                      onChange={(e) => onAgeFilterChange({
                        ...ageFilter,
                        min: parseInt(e.target.value) || 0
                      })}
                      className="h-8"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={ageFilter.max === 365 ? '' : ageFilter.max}
                      onChange={(e) => onAgeFilterChange({
                        ...ageFilter,
                        max: parseInt(e.target.value) || 365
                      })}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {priorityFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Priority: {priorityFilter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onPriorityFilterChange('all')}
              />
            </Badge>
          )}
          
          {locationFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {locationFilter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onLocationFilterChange('')}
              />
            </Badge>
          )}
          
          {(ageFilter.min > 0 || ageFilter.max < 365) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Days: {ageFilter.min}-{ageFilter.max}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onAgeFilterChange({ min: 0, max: 365 })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default WaitingListControls;

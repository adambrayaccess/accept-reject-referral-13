
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
  X,
  Table,
  Grid3X3
} from 'lucide-react';

interface WaitingListControlsProps {
  filters: any;
  updateFilters: (updates: any) => void;
  clearFilters: () => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  view: 'table' | 'grid';
  onViewChange: (view: 'table' | 'grid') => void;
}

const WaitingListControls = ({
  filters,
  updateFilters,
  clearFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  view,
  onViewChange
}: WaitingListControlsProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priority !== 'all') count++;
    if (filters.location) count++;
    if (filters.search) count++;
    if (filters.ageRange.min > 0 || filters.ageRange.max < 365) count++;
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
            value={filters.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-8"
          />
        </div>

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

          <div className="flex gap-1 border rounded-md">
            <Button
              variant={view === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('table')}
              className="rounded-r-none"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('grid')}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

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
                    onClick={clearFilters}
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
                  <Select 
                    value={filters.priority || 'all'} 
                    onValueChange={(value) => updateFilters({ priority: value })}
                  >
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
                    value={filters.location || ''}
                    onChange={(e) => updateFilters({ location: e.target.value })}
                    className="h-8"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-2 block">Days Waiting</label>
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
                      className="h-8"
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
          
          {filters.priority !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Priority: {filters.priority}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ priority: 'all' })}
              />
            </Badge>
          )}
          
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.location}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ location: '' })}
              />
            </Badge>
          )}
          
          {(filters.ageRange?.min > 0 || filters.ageRange?.max < 365) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Days: {filters.ageRange?.min || 0}-{filters.ageRange?.max || 365}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ ageRange: { min: 0, max: 365 } })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default WaitingListControls;

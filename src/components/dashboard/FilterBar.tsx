
import { Filter } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
}

const FilterBar = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter
}: FilterBarProps) => {
  // Calculate active filter count
  const activeFilterCount = (statusFilter !== 'all' ? 1 : 0) + 
                           (priorityFilter !== 'all' ? 1 : 0);

  // Helper function to determine if a filter item is active
  const isActive = (type: 'status' | 'priority', value: string) => {
    return (type === 'status' && statusFilter === value) ||
           (type === 'priority' && priorityFilter === value);
  };
  
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem 
              className={isActive('status', 'all') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setStatusFilter('all')}
            >
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isActive('status', 'new') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setStatusFilter('new')}
            >
              New
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isActive('status', 'accepted') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setStatusFilter('accepted')}
            >
              Accepted
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isActive('status', 'rejected') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isActive('status', 'pre-assessment') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setStatusFilter('pre-assessment')}
            >
              Pre-Assessment
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isActive('status', 'assessed') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setStatusFilter('assessed')}
            >
              Assessed
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isActive('status', 'pre-admission-assessment') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setStatusFilter('pre-admission-assessment')}
            >
              Pre-admission Assessment
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isActive('status', 'waiting-list') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setStatusFilter('waiting-list')}
            >
              Waiting List
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={isActive('status', 'refer-to-another-specialty') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setStatusFilter('refer-to-another-specialty')}
            >
              Refer to Another Specialty
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              className={isActive('priority', 'all') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setPriorityFilter('all')}
            >
              All Priorities
            </DropdownMenuItem>
            <DropdownMenuItem
              className={isActive('priority', 'routine') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setPriorityFilter('routine')}
            >
              Routine
            </DropdownMenuItem>
            <DropdownMenuItem
              className={isActive('priority', 'urgent') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setPriorityFilter('urgent')}
            >
              Urgent
            </DropdownMenuItem>
            <DropdownMenuItem
              className={isActive('priority', 'emergency') ? 'bg-accent text-accent-foreground' : ''}
              onClick={() => setPriorityFilter('emergency')}
            >
              Emergency
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterBar;

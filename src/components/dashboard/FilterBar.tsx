
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface FilterBarProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
}

interface ExtendedFilters {
  status: string[];
  priority: string[];
  hcpReferredTo: string;
  reasonForReferral: string;
  source: string;
}

const FilterBar = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter
}: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ExtendedFilters>({
    status: statusFilter !== 'all' ? [statusFilter] : [],
    priority: priorityFilter !== 'all' ? [priorityFilter] : [],
    hcpReferredTo: '',
    reasonForReferral: '',
    source: ''
  });

  const availableStatuses = [
    'new',
    'accepted', 
    'rejected',
    'pre-assessment',
    'assessed',
    'pre-admission-assessment',
    'waiting-list',
    'refer-to-another-specialty'
  ];

  const availablePriorities = ['routine', 'urgent', 'emergency'];

  const availableSources = [
    'GP Referral',
    'Hospital Transfer',
    'A&E Referral',
    'Self Referral',
    'Consultant to Consultant',
    'Other'
  ];

  const handleReset = () => {
    const resetFilters: ExtendedFilters = {
      status: [],
      priority: [],
      hcpReferredTo: '',
      reasonForReferral: '',
      source: ''
    };
    setLocalFilters(resetFilters);
  };

  const handleApplyFilters = () => {
    // Apply filters to the original filter functions
    setStatusFilter(localFilters.status.length > 0 ? localFilters.status[0] : 'all');
    setPriorityFilter(localFilters.priority.length > 0 ? localFilters.priority[0] : 'all');
    setIsOpen(false);
  };

  const toggleStatus = (status: string) => {
    setLocalFilters(prev => {
      const newStatuses = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      
      return { ...prev, status: newStatuses };
    });
  };

  const togglePriority = (priority: string) => {
    setLocalFilters(prev => {
      const newPriorities = prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority];
      
      return { ...prev, priority: newPriorities };
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.status.length > 0) count++;
    if (localFilters.priority.length > 0) count++;
    if (localFilters.hcpReferredTo) count++;
    if (localFilters.reasonForReferral) count++;
    if (localFilters.source) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Referral Filters</h3>
            <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
          </div>

          <Accordion type="multiple" defaultValue={['status', 'priority']}>
            <AccordionItem value="status">
              <AccordionTrigger className="py-2">
                <span>Status</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {availableStatuses.map(status => (
                    <Button 
                      key={status} 
                      variant={localFilters.status.includes(status) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => toggleStatus(status)}
                      className="w-full justify-start capitalize"
                    >
                      {localFilters.status.includes(status) && (
                        <Check className="mr-2 h-3 w-3" />
                      )}
                      {status.replace(/-/g, ' ')}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="priority">
              <AccordionTrigger className="py-2">
                <span>Priority</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {availablePriorities.map(priority => (
                    <Button 
                      key={priority} 
                      variant={localFilters.priority.includes(priority) ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => togglePriority(priority)}
                      className="w-full justify-start capitalize"
                    >
                      {localFilters.priority.includes(priority) && (
                        <Check className="mr-2 h-3 w-3" />
                      )}
                      {priority}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hcp">
              <AccordionTrigger className="py-2">
                <span>HCP Referred to</span>
              </AccordionTrigger>
              <AccordionContent>
                <Input
                  placeholder="Enter HCP name or organization..."
                  value={localFilters.hcpReferredTo}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    hcpReferredTo: e.target.value
                  }))}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reason">
              <AccordionTrigger className="py-2">
                <span>Reason for Referral</span>
              </AccordionTrigger>
              <AccordionContent>
                <Input
                  placeholder="Enter reason for referral..."
                  value={localFilters.reasonForReferral}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    reasonForReferral: e.target.value
                  }))}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="source">
              <AccordionTrigger className="py-2">
                <span>Source</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {availableSources.map(source => (
                    <Button 
                      key={source} 
                      variant={localFilters.source === source ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        source: prev.source === source ? '' : source
                      }))}
                      className="w-full justify-start"
                    >
                      {localFilters.source === source && (
                        <Check className="mr-2 h-3 w-3" />
                      )}
                      {source}
                    </Button>
                  ))}
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
  );
};

export default FilterBar;

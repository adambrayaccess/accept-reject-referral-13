
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { WaitingListFilters } from '@/hooks/waitingList/useWaitingListFilters';

interface WaitingListFiltersProps {
  filters: WaitingListFilters;
  updateFilters: (filters: Partial<WaitingListFilters>) => void;
  clearFilters: () => void;
}

const WaitingListFiltersComponent = ({ filters, updateFilters, clearFilters }: WaitingListFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTagRemove = (tagToRemove: string) => {
    updateFilters({
      tags: filters.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const hasActiveFilters = 
    filters.priority !== 'all' ||
    filters.location !== '' ||
    filters.tags.length > 0 ||
    filters.appointmentStatus !== 'all' ||
    filters.ageRange.min > 0 ||
    filters.ageRange.max < 365 ||
    filters.rttBreachRisk !== 'all' ||
    filters.rttDaysRange.min > 0 ||
    filters.rttDaysRange.max < 126;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filter Options</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={filters.priority}
                  onValueChange={(value) => updateFilters({ priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => updateFilters({ location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Appointment Status</Label>
                <Select
                  value={filters.appointmentStatus}
                  onValueChange={(value) => updateFilters({ appointmentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="due">Due soon</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>RTT Breach Risk</Label>
                <Select
                  value={filters.rttBreachRisk}
                  onValueChange={(value) => updateFilters({ rttBreachRisk: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All risk levels</SelectItem>
                    <SelectItem value="breached">Breached</SelectItem>
                    <SelectItem value="high">High risk</SelectItem>
                    <SelectItem value="medium">Medium risk</SelectItem>
                    <SelectItem value="low">Low risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Days Waiting Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.ageRange.min}
                    onChange={(e) => updateFilters({ 
                      ageRange: { ...filters.ageRange, min: Number(e.target.value) || 0 }
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.ageRange.max}
                    onChange={(e) => updateFilters({ 
                      ageRange: { ...filters.ageRange, max: Number(e.target.value) || 365 }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>RTT Days Remaining</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.rttDaysRange.min}
                    onChange={(e) => updateFilters({ 
                      rttDaysRange: { ...filters.rttDaysRange, min: Number(e.target.value) || 0 }
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.rttDaysRange.max}
                    onChange={(e) => updateFilters({ 
                      rttDaysRange: { ...filters.rttDaysRange, max: Number(e.target.value) || 126 }
                    })}
                  />
                </div>
              </div>
            </div>

            {filters.tags.length > 0 && (
              <div className="space-y-2">
                <Label>Active Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleTagRemove(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default WaitingListFiltersComponent;

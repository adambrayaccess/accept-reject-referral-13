
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterBarProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  specialtyFilter: string;
  setSpecialtyFilter: (value: string) => void;
  specialties: string[];
}

const FilterBar = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  specialtyFilter,
  setSpecialtyFilter,
  specialties
}: FilterBarProps) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="routine">Routine</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty, index) => (
              <SelectItem key={index} value={specialty}>
                {specialty === 'all' ? 'All Specialties' : specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default FilterBar;

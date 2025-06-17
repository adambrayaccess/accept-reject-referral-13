
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface WaitingListSortAndFilterControlsProps {
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const WaitingListSortAndFilterControls = ({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}: WaitingListSortAndFilterControlsProps) => {
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={sortField} onValueChange={setSortField}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created">Date Created</SelectItem>
          <SelectItem value="patient">Patient Name</SelectItem>
          <SelectItem value="age">Patient Age</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="daysWaiting">Days Waiting</SelectItem>
          <SelectItem value="location">Location</SelectItem>
          <SelectItem value="referrer">Referrer</SelectItem>
          <SelectItem value="appointmentStatus">Appointment Status</SelectItem>
          <SelectItem value="rttTargetDate">RTT Target Date</SelectItem>
          <SelectItem value="rttBreachRisk">RTT Breach Risk</SelectItem>
          <SelectItem value="rttDaysRemaining">RTT Days Remaining</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSortDirection}
        className="gap-1"
      >
        {sortDirection === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
        {sortDirection === 'asc' ? 'Asc' : 'Desc'}
      </Button>
    </div>
  );
};

export default WaitingListSortAndFilterControls;

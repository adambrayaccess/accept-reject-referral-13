
import { useEffect, useRef } from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Referral } from '@/types/referral';

interface WaitingListTableHeaderProps {
  referrals: Referral[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: () => void;
}

const WaitingListTableHeader = ({
  referrals,
  isAllSelected,
  isIndeterminate,
  onSelectAll
}: WaitingListTableHeaderProps) => {
  const checkboxRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      const inputElement = checkboxRef.current.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.indeterminate = isIndeterminate;
      }
    }
  }, [isIndeterminate]);

  return (
    <TableHeader className="bg-secondary/50">
      <TableRow role="row">
        <TableHead className="w-10" scope="col" aria-label="Drag handle column"></TableHead>
        <TableHead className="w-10" scope="col">
          <Checkbox
            ref={checkboxRef}
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            aria-label={isAllSelected ? `Deselect all ${referrals.length} referrals` : `Select all ${referrals.length} referrals`}
            aria-describedby="select-all-description"
            title={isAllSelected ? 'Deselect all referrals' : 'Select all referrals'}
          />
          <span id="select-all-description" className="sr-only">
            {isIndeterminate ? 'Some referrals are selected' : isAllSelected ? 'All referrals are selected' : 'No referrals are selected'}
          </span>
        </TableHead>
        <TableHead className="w-[200px]" scope="col" id="patient-name-header">Patient Name</TableHead>
        <TableHead className="w-[80px]" scope="col" id="priority-header">Priority</TableHead>
        <TableHead className="w-[100px]" scope="col" id="days-waiting-header">Days Waiting</TableHead>
        <TableHead className="w-[120px]" scope="col" id="location-header">Location</TableHead>
        <TableHead className="w-[160px]" scope="col" id="referrer-header">Referrer</TableHead>
        <TableHead className="w-[100px]" scope="col" id="date-header">Date</TableHead>
        <TableHead className="w-[140px]" scope="col" id="tags-header">Tags</TableHead>
        <TableHead className="w-[140px]" scope="col" id="appointment-status-header">Appointment Status</TableHead>
        <TableHead className="w-[120px]" scope="col" id="target-date-header">Target Date</TableHead>
        <TableHead className="w-[140px]" scope="col" id="care-pathway-header">Care Pathway</TableHead>
        <TableHead className="w-[80px]" scope="col" id="rtt-header" title="Referral to Treatment pathway">RTT</TableHead>
        <TableHead className="w-[160px]" scope="col" id="assigned-team-header">Assigned Team</TableHead>
        <TableHead className="w-10" scope="col" aria-label="Actions column"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default WaitingListTableHeader;

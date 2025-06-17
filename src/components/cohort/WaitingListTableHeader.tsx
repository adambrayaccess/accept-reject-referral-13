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
    <TableHeader>
      <TableRow>
        <TableHead className="w-10"></TableHead>
        <TableHead className="w-10">
          <Checkbox
            ref={checkboxRef}
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            aria-label={`Select all ${referrals.length} referrals`}
          />
        </TableHead>
        <TableHead className="min-w-[140px]">Patient Name</TableHead>
        <TableHead className="w-16">Age</TableHead>
        <TableHead className="w-20">Priority</TableHead>
        <TableHead className="w-24">Days Waiting</TableHead>
        <TableHead className="w-24">Location</TableHead>
        <TableHead className="min-w-[120px]">Referrer</TableHead>
        <TableHead className="w-24">Date</TableHead>
        <TableHead className="min-w-[100px]">Tags</TableHead>
        <TableHead className="min-w-[120px]">Appointment Status</TableHead>
        <TableHead className="min-w-[100px]">Target Date</TableHead>
        <TableHead className="min-w-[120px]">Care Pathway</TableHead>
        <TableHead className="min-w-[80px]">RTT</TableHead>
        <TableHead className="min-w-[120px]">AI Actions</TableHead>
        <TableHead className="min-w-[100px]">Sub-referrals</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default WaitingListTableHeader;

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Referral } from '@/types/referral';

interface ReferralTableHeaderProps {
  referrals?: Referral[];
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
  onSelectAll?: () => void;
}

const ReferralTableHeader = ({ 
  referrals = [], 
  isAllSelected = false, 
  isIndeterminate = false, 
  onSelectAll 
}: ReferralTableHeaderProps) => {
  // Handle checkbox state - if indeterminate, show as unchecked but visually different
  const checkboxChecked = isIndeterminate ? false : isAllSelected;

  return (
    <TableHeader className="bg-secondary/50">
      <TableRow>
        <TableHead className="w-10">
          {referrals.length > 0 && (
            <Checkbox
              checked={checkboxChecked}
              onCheckedChange={onSelectAll}
              aria-label="Select all referrals"
            />
          )}
        </TableHead>
        <TableHead className="w-10"></TableHead>
        <TableHead className="w-16">Priority</TableHead>
        <TableHead className="min-w-[120px]">Patient Name</TableHead>
        <TableHead className="min-w-[100px]">NHS Number</TableHead>
        <TableHead className="min-w-[80px]">UBRN</TableHead>
        <TableHead className="min-w-[100px]">Contact</TableHead>
        <TableHead className="min-w-[140px]">Referred To</TableHead>
        <TableHead className="min-w-[160px] font-bold">Reason for Referral</TableHead>
        <TableHead className="min-w-[140px]">Tags</TableHead>
        <TableHead className="w-16">Source</TableHead>
        <TableHead className="w-16">Type</TableHead>
        <TableHead className="w-20">Status</TableHead>
        <TableHead className="w-10"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ReferralTableHeader;

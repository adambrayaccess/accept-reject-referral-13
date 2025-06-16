
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReferralTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12"></TableHead>
        <TableHead className="w-20">Priority</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Gender</TableHead>
        <TableHead>NHS Number</TableHead>
        <TableHead>UBRN</TableHead>
        <TableHead>Referral Date and time</TableHead>
        <TableHead>Contact Number</TableHead>
        <TableHead>HCP referred to</TableHead>
        <TableHead>Reason for referral</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Source</TableHead>
        <TableHead className="w-12"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ReferralTableHeader;


import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReferralTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="p-2 w-8"></TableHead>
        <TableHead className="p-2 w-20 text-xs font-medium">Priority</TableHead>
        <TableHead className="p-2 min-w-[200px] text-xs font-medium">Name</TableHead>
        <TableHead className="p-2 w-16 text-xs font-medium">Gender</TableHead>
        <TableHead className="p-2 w-32 text-xs font-medium">NHS Number</TableHead>
        <TableHead className="p-2 w-32 text-xs font-medium">UBRN</TableHead>
        <TableHead className="p-2 w-32 text-xs font-medium">Referral Date</TableHead>
        <TableHead className="p-2 w-32 text-xs font-medium">Contact</TableHead>
        <TableHead className="p-2 min-w-[180px] text-xs font-medium">HCP referred to</TableHead>
        <TableHead className="p-2 min-w-[200px] max-w-[300px] text-xs font-medium">Reason for referral</TableHead>
        <TableHead className="p-2 w-24 text-xs font-medium">Status</TableHead>
        <TableHead className="p-2 w-20 text-xs font-medium">Source</TableHead>
        <TableHead className="p-2 w-8"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ReferralTableHeader;

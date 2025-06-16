
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReferralTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10"></TableHead>
        <TableHead className="w-16">Priority</TableHead>
        <TableHead className="min-w-[120px]">Name</TableHead>
        <TableHead className="w-16">Gender</TableHead>
        <TableHead className="min-w-[100px]">NHS Number</TableHead>
        <TableHead className="min-w-[80px]">UBRN</TableHead>
        <TableHead className="min-w-[120px]">Referral Date and time</TableHead>
        <TableHead className="min-w-[100px]">Contact Number</TableHead>
        <TableHead className="min-w-[140px]">HCP referred to</TableHead>
        <TableHead className="min-w-[160px]">Reason for referral</TableHead>
        <TableHead className="w-20">Status</TableHead>
        <TableHead className="w-16">Source</TableHead>
        <TableHead className="w-10"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ReferralTableHeader;

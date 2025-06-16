
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const WaitingListTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10"></TableHead>
        <TableHead className="w-10">Select</TableHead>
        <TableHead className="min-w-[140px]">Patient Name</TableHead>
        <TableHead className="w-16">Age</TableHead>
        <TableHead className="w-20">Priority</TableHead>
        <TableHead className="w-24">Days Waiting</TableHead>
        <TableHead className="w-24">Location</TableHead>
        <TableHead className="min-w-[120px]">Referrer</TableHead>
        <TableHead className="w-24">Date</TableHead>
        <TableHead className="min-w-[100px]">Tags</TableHead>
        <TableHead className="min-w-[120px]">Appointment Status</TableHead>
        <TableHead className="min-w-[120px]">AI Actions</TableHead>
        <TableHead className="min-w-[100px]">Sub-referrals</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default WaitingListTableHeader;

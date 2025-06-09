
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const WaitingListTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12"></TableHead>
        <TableHead className="w-12"></TableHead>
        <TableHead>Patient</TableHead>
        <TableHead>Age</TableHead>
        <TableHead>Priority</TableHead>
        <TableHead>Days Waiting</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Referrer</TableHead>
        <TableHead>Date Added</TableHead>
        <TableHead>Tags</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default WaitingListTableHeader;


import { AuditLogEntry } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceStrict } from 'date-fns';
import { Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface StatusTimingPanelProps {
  entries?: AuditLogEntry[];
}

const StatusTimingPanel = ({ entries = [] }: StatusTimingPanelProps) => {
  // Filter only status change entries
  const statusChanges = entries
    .filter(entry => entry.action.toLowerCase().includes('status'))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Calculate time differences between status changes
  const timingData = statusChanges.map((entry, index) => {
    const currentTime = new Date(entry.timestamp).getTime();
    const previousTime = index > 0 
      ? new Date(statusChanges[index - 1].timestamp).getTime() 
      : null;
    
    const timeDiff = previousTime 
      ? formatDistanceStrict(currentTime, previousTime) 
      : 'Initial Status';
    
    return {
      status: entry.action,
      timestamp: new Date(entry.timestamp).toLocaleString(),
      timeSinceLast: timeDiff,
    };
  });

  // Calculate total time from first to last status change
  const totalTime = statusChanges.length > 1 
    ? formatDistanceStrict(
        new Date(statusChanges[statusChanges.length - 1].timestamp),
        new Date(statusChanges[0].timestamp)
      )
    : 'N/A';

  if (statusChanges.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Status Timing Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status Change</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Time Since Previous</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timingData.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.timestamp}</TableCell>
                <TableCell>{item.timeSinceLast}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 text-sm">
          <div className="font-medium">Total Time Elapsed:</div>
          <div>{totalTime}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusTimingPanel;

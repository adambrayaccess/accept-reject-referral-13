
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AuditLogEntry } from '@/types/referral';
import { formatDistanceStrict } from 'date-fns';
import StatusTimingPanel from './StatusTimingPanel';

interface AuditLogProps {
  entries?: AuditLogEntry[];
}

const AuditLog = ({ entries = [] }: AuditLogProps) => {
  // Sort entries by timestamp
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Calculate time differences between entries
  const entriesWithTiming = sortedEntries.map((entry, index) => {
    const currentTime = new Date(entry.timestamp).getTime();
    const previousTime = index > 0 
      ? new Date(sortedEntries[index - 1].timestamp).getTime() 
      : null;
    
    const timeSincePrevious = previousTime 
      ? formatDistanceStrict(currentTime, previousTime) 
      : 'Initial';
    
    return {
      ...entry,
      timeSincePrevious
    };
  });

  return (
    <div className="space-y-4">
      <StatusTimingPanel entries={entries} />
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="audit">
          <AccordionTrigger>Audit Log</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Time Since Previous</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entriesWithTiming.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.action}</TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{entry.timeSincePrevious}</TableCell>
                      <TableCell>{entry.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AuditLog;

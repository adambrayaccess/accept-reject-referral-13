
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuditLogEntry } from '@/types/referral';
import StatusTimingPanel from './StatusTimingPanel';

interface AuditLogProps {
  entries?: AuditLogEntry[];
}

const AuditLog = ({ entries = [] }: AuditLogProps) => {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="audit">
          <AccordionTrigger>Audit Log</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {entries?.map((entry, index) => (
                <div key={index} className="mb-3 text-sm">
                  <div className="font-medium">{entry.action}</div>
                  <div className="text-muted-foreground">
                    {entry.user} - {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  {entry.notes && (
                    <div className="mt-1 text-muted-foreground">{entry.notes}</div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <StatusTimingPanel entries={entries} />
    </div>
  );
};

export default AuditLog;

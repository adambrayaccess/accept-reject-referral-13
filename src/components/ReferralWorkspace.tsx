
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ReferralActions from './ReferralActions';
import { Referral } from '@/types/referral';
import { FilePlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReferralWorkspaceProps {
  referral: Referral;
  onStatusChange: () => void;
}

const triageStatuses = [
  'received',
  'reviewing',
  'pre-assessment',
  'post-assessment',
  'triaged'
] as const;

type TriageStatus = typeof triageStatuses[number];

const ReferralWorkspace = ({ referral, onStatusChange }: ReferralWorkspaceProps) => {
  const [note, setNote] = useState('');
  const [triageStatus, setTriageStatus] = useState<TriageStatus>('received');
  const { toast } = useToast();

  const handleAddNote = () => {
    // This would typically integrate with a backend service
    if (!note.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Note added",
      description: "Your collaboration note has been saved",
    });
    setNote('');
  };

  const handleTriageStatusChange = (status: TriageStatus) => {
    setTriageStatus(status);
    toast({
      title: "Status Updated",
      description: `Triage status changed to ${status}`,
    });
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Triage Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ReferralActions referral={referral} onStatusChange={onStatusChange} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Triage Status</label>
              <Select
                disabled={referral.status !== 'accepted'}
                value={triageStatus}
                onValueChange={(value: TriageStatus) => handleTriageStatusChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select triage status" />
                </SelectTrigger>
                <SelectContent>
                  {triageStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Triage Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="audit">
              <AccordionTrigger>Audit Log</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  {referral.auditLog?.map((entry, index) => (
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

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Collaboration Notes</h3>
            <Textarea
              placeholder="Add a note for your colleagues..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleAddNote} 
              className="w-full"
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>

          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {referral.collaborationNotes?.map((note, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{note.author}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(note.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm">{note.content}</p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralWorkspace;

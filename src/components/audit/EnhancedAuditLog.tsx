import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AuditLogEntry } from '@/types/referral';
import { ClinicalNote, ClinicalNotesService } from '@/services/clinicalNotesService';
import { formatDistanceStrict } from 'date-fns';
import { FileText, Activity } from 'lucide-react';
import StatusTimingPanel from './StatusTimingPanel';

interface EnhancedAuditLogProps {
  entries?: AuditLogEntry[];
  referralId: string;
}

interface CombinedEntry {
  id: string;
  type: 'audit' | 'note';
  action: string;
  user: string;
  timestamp: string;
  notes?: string;
  noteContent?: string;
  noteType?: string;
  isInternal?: boolean;
  timeSincePrevious?: string;
}

const EnhancedAuditLog = ({ entries = [], referralId }: EnhancedAuditLogProps) => {
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClinicalNotes();
  }, [referralId]);

  const loadClinicalNotes = async () => {
    try {
      const notes = await ClinicalNotesService.getNotesByReferralId(referralId);
      setClinicalNotes(notes);
    } catch (error) {
      console.error('Error loading clinical notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Combine audit entries and clinical notes
  const combinedEntries: CombinedEntry[] = [
    // Convert audit entries
    ...entries.map(entry => ({
      id: `audit-${entry.timestamp}-${entry.action}`,
      type: 'audit' as const,
      action: entry.action,
      user: entry.user,
      timestamp: entry.timestamp,
      notes: entry.notes
    })),
    // Convert clinical notes
    ...clinicalNotes.map(note => ({
      id: `note-${note.id}`,
      type: 'note' as const,
      action: `Clinical Note: ${note.noteType}`,
      user: note.createdBy,
      timestamp: note.createdAt,
      noteContent: note.noteContent,
      noteType: note.noteType,
      isInternal: note.isInternal
    }))
  ];

  // Sort by timestamp
  const sortedEntries = combinedEntries.sort((a, b) => 
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

  const getEntryIcon = (type: 'audit' | 'note') => {
    return type === 'note' ? <FileText className="h-3 w-3" /> : <Activity className="h-3 w-3" />;
  };

  const getNoteTypeBadge = (noteType?: string, isInternal?: boolean) => {
    if (!noteType) return null;
    
    const badgeText = noteType.charAt(0).toUpperCase() + noteType.slice(1);
    return (
      <div className="flex items-center gap-1">
        <Badge variant="secondary" className="text-xs">
          {badgeText}
        </Badge>
        {isInternal && (
          <Badge variant="outline" className="text-xs">
            Internal
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <StatusTimingPanel entries={entries} />
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="audit">
          <AccordionTrigger>Triage History & Clinical Notes</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Action</TableHead>
                    <TableHead className="w-[15%]">User</TableHead>
                    <TableHead className="w-[20%]">Timestamp</TableHead>
                    <TableHead className="w-[15%]">Time Since</TableHead>
                    <TableHead className="w-[20%]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : entriesWithTiming.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No entries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    entriesWithTiming.map((entry, index) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium w-[30%] break-words">
                          <div className="flex items-center gap-2">
                            {getEntryIcon(entry.type)}
                            {entry.action}
                          </div>
                          {entry.type === 'note' && entry.noteType && (
                            <div className="mt-1">
                              {getNoteTypeBadge(entry.noteType, entry.isInternal)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="w-[15%] break-words">{entry.user}</TableCell>
                        <TableCell className="w-[20%] text-xs break-words">
                          {new Date(entry.timestamp).toLocaleDateString()}<br />
                          <span className="text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </span>
                        </TableCell>
                        <TableCell className="w-[15%] text-xs break-words">{entry.timeSincePrevious}</TableCell>
                        <TableCell className="w-[20%] text-xs break-words">
                          {entry.type === 'note' ? (
                            <div className="max-w-xs">
                              <p className="text-xs text-muted-foreground line-clamp-3">
                                {entry.noteContent}
                              </p>
                            </div>
                          ) : (
                            entry.notes || '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EnhancedAuditLog;
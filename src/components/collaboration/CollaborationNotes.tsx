
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilePlus } from 'lucide-react';
import { CollaborationNote } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';

interface CollaborationNotesProps {
  notes?: CollaborationNote[];
}

const CollaborationNotes = ({ notes = [] }: CollaborationNotesProps) => {
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const handleAddNote = () => {
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

  return (
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
        className="w-full text-white hover:bg-[#007A7A]/90"
        style={{ backgroundColor: '#007A7A' }}
      >
        <FilePlus className="mr-2 h-4 w-4" />
        Add Note
      </Button>

      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        {notes?.map((note, index) => (
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
    </div>
  );
};

export default CollaborationNotes;

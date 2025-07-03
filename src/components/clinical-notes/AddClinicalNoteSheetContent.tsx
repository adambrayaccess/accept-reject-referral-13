import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, FileText, User, Calendar } from 'lucide-react';
import { ClinicalNotesService } from '@/services/clinicalNotesService';
import { useToast } from '@/hooks/use-toast';

interface AddClinicalNoteSheetContentProps {
  referralId: string;
  onNoteCreated?: () => void;
  onClose: () => void;
}

const noteTypes = [
  { value: 'clinical', label: 'Clinical Note' },
  { value: 'assessment', label: 'Assessment Note' },
  { value: 'plan', label: 'Treatment Plan' },
  { value: 'review', label: 'Review Note' },
  { value: 'discharge', label: 'Discharge Note' },
  { value: 'other', label: 'Other' }
];

const AddClinicalNoteSheetContent = ({ referralId, onNoteCreated, onClose }: AddClinicalNoteSheetContentProps) => {
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteType, setNoteType] = useState<string>('clinical');
  const [isInternal, setIsInternal] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter note content before saving.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await ClinicalNotesService.createNote({
        referralId,
        noteContent: noteContent.trim(),
        noteType,
        isInternal
      });

      if (result.success) {
        toast({
          title: 'Note Saved',
          description: 'The clinical note has been saved successfully.',
        });
        
        // Clear form and close
        setNoteContent('');
        setNoteType('clinical');
        setIsInternal(true);
        onNoteCreated?.();
        onClose();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save note.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving the note.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getNoteTypeLabel = (value: string) => {
    const type = noteTypes.find(type => type.value === value);
    return type ? type.label : value;
  };

  return (
    <div className="space-y-6">
      {/* Note Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Note Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="note-type">Note Type</Label>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a note type" />
              </SelectTrigger>
              <SelectContent>
                {noteTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="internal-note" 
              checked={isInternal} 
              onCheckedChange={(checked) => setIsInternal(checked as boolean)}
            />
            <Label htmlFor="internal-note" className="text-sm">
              Internal note (not visible to patient)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Note Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Note Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="note-content">Clinical Note</Label>
            <Textarea
              id="note-content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={12}
              className="resize-none"
              placeholder="Enter your clinical note here..."
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {getNoteTypeLabel(noteType)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date().toLocaleDateString()}
            </Badge>
            {isInternal && (
              <Badge variant="outline" className="text-xs">
                Internal
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleSaveNote} 
              disabled={isSaving || !noteContent.trim()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Note'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddClinicalNoteSheetContent;
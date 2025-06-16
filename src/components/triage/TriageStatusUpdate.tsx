
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clipboard, Brain } from 'lucide-react';
import { TriageStatus } from '@/types/referral';
import { updateTriageStatus } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';

interface TriageStatusUpdateProps {
  referralId: string;
  currentStatus?: TriageStatus;
  onStatusChange: () => void;
  aiSuggestedStatus?: TriageStatus;
  aiConfidence?: number;
}

const triageStatuses: { value: TriageStatus; label: string }[] = [
  { value: 'pre-assessment', label: 'Pre-Assessment' },
  { value: 'assessed', label: 'Assessed' },
  { value: 'pre-admission-assessment', label: 'Pre-admission Assessment' },
  { value: 'waiting-list', label: 'Waiting List' },
  { value: 'refer-to-another-specialty', label: 'Refer to Another Specialty' },
];

const TriageStatusUpdate = ({ 
  referralId, 
  currentStatus, 
  onStatusChange, 
  aiSuggestedStatus,
  aiConfidence 
}: TriageStatusUpdateProps) => {
  const [triageStatus, setTriageStatus] = useState<TriageStatus | ''>(currentStatus || '');
  const [triageNotes, setTriageNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const handleTriageStatusChange = async () => {
    if (!triageStatus) {
      toast({
        title: "Required Field",
        description: "Please select a triage status",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const notes = aiSuggestedStatus === triageStatus && aiConfidence 
        ? `${triageNotes}\n\nAI-suggested status (${Math.round(aiConfidence * 100)}% confidence)`
        : triageNotes;

      const updated = await updateTriageStatus(referralId, triageStatus, notes);
      
      if (updated) {
        toast({
          title: "Status Updated",
          description: `Triage status changed to ${
            triageStatuses.find(s => s.value === triageStatus)?.label
          }`,
        });
        setTriageNotes('');
        onStatusChange();
      } else {
        throw new Error("Failed to update triage status");
      }
    } catch (error) {
      console.error("Error updating triage status:", error);
      toast({
        title: "Error",
        description: "Failed to update triage status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleApplyAISuggestion = () => {
    if (aiSuggestedStatus) {
      setTriageStatus(aiSuggestedStatus);
      setTriageNotes(`AI-suggested status change based on clinical analysis (${Math.round((aiConfidence || 0) * 100)}% confidence)`);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Update Triage Status</h3>
        {aiSuggestedStatus && aiSuggestedStatus !== currentStatus && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleApplyAISuggestion}
            className="text-xs"
          >
            <Brain className="h-3 w-3 mr-1" />
            Apply AI Suggestion
          </Button>
        )}
      </div>

      {aiSuggestedStatus && aiSuggestedStatus !== currentStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">AI Suggestion</span>
            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
              {Math.round((aiConfidence || 0) * 100)}% confidence
            </Badge>
          </div>
          <p className="text-sm text-blue-700">
            Recommend changing to: {triageStatuses.find(s => s.value === aiSuggestedStatus)?.label}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={triageStatus}
          onValueChange={(value: TriageStatus) => setTriageStatus(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select triage status" />
          </SelectTrigger>
          <SelectContent>
            {triageStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-2">
                  {status.label}
                  {aiSuggestedStatus === status.value && (
                    <Brain className="h-3 w-3 text-blue-600" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Textarea
        placeholder="Add notes about status change (optional)"
        value={triageNotes}
        onChange={(e) => setTriageNotes(e.target.value)}
      />
      
      <Button 
        className="w-full" 
        onClick={handleTriageStatusChange}
        disabled={isUpdatingStatus || !triageStatus}
      >
        <Clipboard className="mr-2 h-4 w-4" />
        {isUpdatingStatus ? "Updating Status..." : "Update Status"}
      </Button>
      
      {currentStatus && (
        <div className="text-sm text-muted-foreground">
          Current status: {
            triageStatuses.find(s => s.value === currentStatus)?.label || 
            currentStatus
          }
        </div>
      )}
    </div>
  );
};

export default TriageStatusUpdate;

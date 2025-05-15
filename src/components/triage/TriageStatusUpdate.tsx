
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Clipboard } from 'lucide-react';
import { TriageStatus } from '@/types/referral';
import { updateTriageStatus } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';

interface TriageStatusUpdateProps {
  referralId: string;
  currentStatus?: TriageStatus;
  onStatusChange: () => void;
}

const triageStatuses: { value: TriageStatus; label: string }[] = [
  { value: 'pre-assessment', label: 'Pre-Assessment' },
  { value: 'assessed', label: 'Assessed' },
  { value: 'pre-admission-assessment', label: 'Pre-admission Assessment' },
  { value: 'waiting-list', label: 'Waiting List' },
];

const TriageStatusUpdate = ({ referralId, currentStatus, onStatusChange }: TriageStatusUpdateProps) => {
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
      const updated = await updateTriageStatus(referralId, triageStatus, triageNotes);
      
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

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-sm font-medium">Update Triage Status</h3>
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
                {status.label}
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

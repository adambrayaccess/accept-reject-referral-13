
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { createSubReferral } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';
import { specialties } from '@/data/specialtyOptions';

interface CreateSubReferralDialogProps {
  parentReferralId: string;
  onSubReferralCreated: () => void;
}

const CreateSubReferralDialog = ({ parentReferralId, onSubReferralCreated }: CreateSubReferralDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [service, setService] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!specialty || !reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in service and reason fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const subReferral = await createSubReferral(parentReferralId, {
        specialty,
        service: service || undefined,
        reason,
        notes: notes || undefined,
        priority
      });

      if (subReferral) {
        toast({
          title: "Sub-referral Created",
          description: `Sub-referral to ${specialty} has been created successfully`,
        });
        
        // Reset form
        setSpecialty('');
        setService('');
        setReason('');
        setNotes('');
        setPriority('routine');
        setIsOpen(false);
        
        onSubReferralCreated();
      } else {
        throw new Error("Failed to create sub-referral");
      }
    } catch (error) {
      console.error('Error creating sub-referral:', error);
      toast({
        title: "Error",
        description: "Failed to create sub-referral. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Sub-referral
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Sub-referral</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialty">Service *</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((spec) => (
                  <SelectItem key={spec.id} value={spec.name}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Sub-service</Label>
            <Input
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Optional sub-service within service"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: 'routine' | 'urgent' | 'emergency') => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Sub-referral *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this sub-referral is needed"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Sub-referral"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubReferralDialog;

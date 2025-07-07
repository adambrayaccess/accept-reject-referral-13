import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, LayoutList } from 'lucide-react';
import { createSubReferral } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';
import { specialties } from '@/data/specialtyOptions';

interface CreateSubReferralSheetProps {
  parentReferralId: string;
  onSubReferralCreated: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateSubReferralSheet = ({ parentReferralId, onSubReferralCreated, isOpen, onOpenChange }: CreateSubReferralSheetProps) => {
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
        onOpenChange(false);
        
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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <LayoutList className="h-6 w-6" />
            Create Sub-referral
          </SheetTitle>
          <SheetDescription className="text-base">
            Create a new sub-referral for specialized care or additional services
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating..." : "Create Sub-referral"}
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CreateSubReferralSheet;

import { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Forward } from 'lucide-react';
import { Referral } from '@/types/referral';
import { updateReferralStatus, sendHL7Message } from '@/services/referralService';
import { useToast } from '@/components/ui/use-toast';
import { specialties } from '@/data/specialtyOptions';

interface ForwardReferralDialogProps {
  referral: Referral;
  onStatusChange: () => void;
}

const ForwardReferralDialog = ({ referral, onStatusChange }: ForwardReferralDialogProps) => {
  const [forwardNotes, setForwardNotes] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleForward = async () => {
    if (!selectedSpecialty) {
      toast({
        title: "Required Field",
        description: "Please select a specialty to forward to.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update the referral status to indicate it's been forwarded
      const statusUpdated = await updateReferralStatus(referral.id, 'accepted', forwardNotes);
      
      // 2. Send HL7 message to EPR indicating the forward
      if (statusUpdated) {
        await sendHL7Message(referral.id, 'accept');
        
        const specialty = specialties.find(s => s.id === selectedSpecialty);
        
        toast({
          title: "Referral Forwarded",
          description: `The referral has been forwarded to ${specialty?.name} specialty. An HL7 message has been sent to the EPR system.`,
          variant: "default",
        });
        
        onStatusChange();
      } else {
        throw new Error("Failed to update referral status");
      }
    } catch (error) {
      console.error("Error forwarding referral:", error);
      toast({
        title: "Error",
        description: "There was a problem forwarding this referral. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Forward className="mr-2 h-4 w-4" />
          Forward Referral
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Forward Referral</AlertDialogTitle>
          <AlertDialogDescription>
            Forward this referral to another specialty team. This will send an HL7 message to the EPR system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Forward to Specialty</label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties
                  .filter(specialty => specialty.name !== referral.specialty)
                  .map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Forwarding Notes</label>
            <Textarea
              placeholder="Add notes about why this referral is being forwarded..."
              value={forwardNotes}
              onChange={(e) => setForwardNotes(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleForward} 
            disabled={isSubmitting || !selectedSpecialty}
          >
            {isSubmitting ? "Processing..." : "Forward"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ForwardReferralDialog;

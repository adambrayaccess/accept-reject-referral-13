
import { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { XCircle, AlertTriangle } from 'lucide-react';
import { Referral } from '@/types/referral';
import { updateReferralStatus, sendHL7Message } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';

interface RejectReferralDialogProps {
  referral: Referral;
  onStatusChange: () => void;
}

const RejectReferralDialog = ({ referral, onStatusChange }: RejectReferralDialogProps) => {
  const [rejectNotes, setRejectNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      // 1. Update the referral status
      const statusUpdated = await updateReferralStatus(referral.id, 'rejected', rejectNotes);
      
      // 2. Send HL7 message to EPR
      if (statusUpdated) {
        await sendHL7Message(referral.id, 'reject');
        
        // 3. Show success toast
        toast({
          title: "Referral Rejected",
          description: "The referral has been rejected and an HL7 message has been sent to the EPR system.",
          variant: "default",
        });
        
        // 4. Refresh the parent component
        onStatusChange();
      } else {
        throw new Error("Failed to update referral status");
      }
    } catch (error) {
      console.error("Error rejecting referral:", error);
      toast({
        title: "Error",
        description: "There was a problem rejecting this referral. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <XCircle className="mr-2 h-4 w-4" />
          Reject Referral
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Reject Referral
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to reject this referral. Please provide a reason for rejection.
            This will send an HL7 message to the EPR system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Textarea
            placeholder="Reason for rejection (required)"
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            required
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleReject} 
            disabled={isSubmitting || !rejectNotes}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isSubmitting ? "Processing..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectReferralDialog;

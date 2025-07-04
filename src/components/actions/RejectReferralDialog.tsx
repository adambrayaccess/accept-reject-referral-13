import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { XCircle, AlertTriangle } from 'lucide-react';
import { Referral } from '@/types/referral';
import { updateReferralStatus, sendHL7Message } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';

interface RejectReferralDialogProps {
  referral: Referral;
  onStatusChange: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const RejectReferralDialog = ({ referral, onStatusChange, open, onOpenChange }: RejectReferralDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
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
        
        // Reset form and close sheet
        setRejectNotes('');
        setIsOpen(false);
        
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="destructive" className="w-full">
          <XCircle className="mr-2 h-4 w-4" />
          Reject Referral
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Reject Referral
          </SheetTitle>
          <SheetDescription className="text-base">
            You are about to reject this referral for {referral.patient.name}. Please provide a reason for rejection. This will send an HL7 message to the EPR system.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Rejection <span className="text-destructive">*</span></label>
                <Textarea
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                {!rejectNotes && (
                  <p className="text-sm text-muted-foreground">
                    A reason for rejection is required and will be included in the HL7 message sent to the EPR system.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button 
                onClick={handleReject} 
                disabled={isSubmitting || !rejectNotes.trim()}
                variant="destructive"
                className="flex-1"
              >
                {isSubmitting ? "Processing..." : "Reject Referral"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default RejectReferralDialog;

import { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';
import { Referral, TriageStatus } from '@/types/referral';
import { updateReferralStatus, sendHL7Message } from '@/services/referralService';
import { useToast } from '@/components/ui/use-toast';
import { healthcareProfessionals } from '@/data/specialtyOptions';

interface AcceptReferralDialogProps {
  referral: Referral;
  onStatusChange: () => void;
}

const triageStatusOptions: { value: TriageStatus; label: string }[] = [
  { value: 'pre-assessment', label: 'Pre-Assessment' },
  { value: 'assessed', label: 'Assessed' },
  { value: 'pre-admission-assessment', label: 'Pre-admission Assessment' },
  { value: 'waiting-list', label: 'Waiting List' },
  { value: 'refer-to-another-specialty', label: 'Refer to Another Specialty' },
];

const AcceptReferralDialog = ({ referral, onStatusChange }: AcceptReferralDialogProps) => {
  const [acceptNotes, setAcceptNotes] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<TriageStatus | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    if (!selectedProfessional || !selectedStatus) {
      toast({
        title: "Required Fields",
        description: "Please select both a healthcare professional and initial status.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update the referral status
      const statusUpdated = await updateReferralStatus(referral.id, 'accepted', acceptNotes);
      
      // 2. Send HL7 message to EPR
      if (statusUpdated) {
        await sendHL7Message(referral.id, 'accept');
        
        const professional = healthcareProfessionals.find(hp => hp.id === selectedProfessional);
        
        toast({
          title: "Referral Accepted",
          description: `The referral has been accepted and allocated to ${professional?.name} with status: ${
            triageStatusOptions.find(s => s.value === selectedStatus)?.label
          }.`,
          variant: "default",
        });
        
        onStatusChange();
      } else {
        throw new Error("Failed to update referral status");
      }
    } catch (error) {
      console.error("Error accepting referral:", error);
      toast({
        title: "Error",
        description: "There was a problem accepting this referral. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full bg-success hover:bg-success/90">
          <CheckCircle className="mr-2 h-4 w-4" />
          Accept Referral
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Accept Referral</AlertDialogTitle>
          <AlertDialogDescription>
            Please allocate this referral to a healthcare professional and set initial status.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Initial Status</label>
            <Select 
              value={selectedStatus} 
              onValueChange={(value: TriageStatus) => setSelectedStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {triageStatusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Healthcare Professional</label>
            <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
              <SelectTrigger>
                <SelectValue placeholder="Select professional" />
              </SelectTrigger>
              <SelectContent>
                {healthcareProfessionals.map((professional) => (
                  <SelectItem key={professional.id} value={professional.id}>
                    {professional.name} - {professional.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Add optional notes (e.g., appointment details)"
            value={acceptNotes}
            onChange={(e) => setAcceptNotes(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleAccept} 
            disabled={isSubmitting || !selectedProfessional || !selectedStatus}
            className="bg-success hover:bg-success/90"
          >
            {isSubmitting ? "Processing..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AcceptReferralDialog;

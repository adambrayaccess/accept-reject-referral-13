import { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Referral, SpecialtyOption, HealthcareProfessional } from '@/types/referral';
import { updateReferralStatus, sendHL7Message } from '@/services/referralService';
import { useToast } from '@/components/ui/use-toast';

interface ReferralActionsProps {
  referral: Referral;
  onStatusChange: () => void;
}

const specialties: SpecialtyOption[] = [
  { id: 'card', name: 'Cardiology' },
  { id: 'derm', name: 'Dermatology' },
  { id: 'neur', name: 'Neurology' },
  { id: 'orth', name: 'Orthopedics' },
  { id: 'onco', name: 'Oncology' },
];

const healthcareProfessionals: HealthcareProfessional[] = [
  { id: 'hp1', name: 'Dr. Sarah Jones', role: 'Consultant', specialty: 'card' },
  { id: 'hp2', name: 'Dr. Michael Chen', role: 'Specialist', specialty: 'card' },
  { id: 'hp3', name: 'Dr. Emma Wilson', role: 'Consultant', specialty: 'derm' },
  { id: 'hp4', name: 'Dr. James Smith', role: 'Specialist', specialty: 'derm' },
  { id: 'hp5', name: 'Dr. Lisa Brown', role: 'Consultant', specialty: 'neur' },
];

const ReferralActions = ({ referral, onStatusChange }: ReferralActionsProps) => {
  const [acceptNotes, setAcceptNotes] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const filteredProfessionals = healthcareProfessionals.filter(
    hp => hp.specialty === selectedSpecialty
  );

  const handleAccept = async () => {
    if (!selectedSpecialty || !selectedProfessional) {
      toast({
        title: "Required Fields",
        description: "Please select both a specialty and healthcare professional.",
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
        const specialty = specialties.find(s => s.id === selectedSpecialty);
        
        toast({
          title: "Referral Accepted",
          description: `The referral has been accepted and allocated to ${professional?.name} in ${specialty?.name}.`,
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

  if (referral.status !== 'new') {
    return (
      <div className="border rounded-lg p-4 bg-muted/50">
        <div className="flex items-center gap-2">
          {referral.status === 'accepted' ? (
            <>
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="font-medium text-success">This referral has been accepted</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">This referral has been rejected</span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Please allocate this referral to a specialty and healthcare professional.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Healthcare Professional</label>
              <Select 
                value={selectedProfessional} 
                onValueChange={setSelectedProfessional}
                disabled={!selectedSpecialty}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedSpecialty ? "Select professional" : "Select specialty first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredProfessionals.map((professional) => (
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
              disabled={isSubmitting || !selectedSpecialty || !selectedProfessional}
              className="bg-success hover:bg-success/90"
            >
              {isSubmitting ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
    </div>
  );
};

export default ReferralActions;


import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';
import { Referral, TriageStatus } from '@/types/referral';
import { updateReferralStatus, sendHL7Message } from '@/services/referralService';
import { useToast } from '@/components/ui/use-toast';
import { healthcareProfessionals, specialties } from '@/data/specialtyOptions';
import TeamSelector from '@/components/team/TeamSelector';
import { getSpecialtyIdByName } from '@/data/specialtyOptions';

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
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<TriageStatus | ''>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedHCPId, setSelectedHCPId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const specialtyId = getSpecialtyIdByName(referral.specialty);

  // Reset selection when status changes
  useEffect(() => {
    if (selectedStatus === 'refer-to-another-specialty') {
      setSelectedProfessional('');
      setSelectedTeamId('');
      setSelectedHCPId('');
    } else {
      setSelectedSpecialty('');
    }
  }, [selectedStatus]);

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedProfessional(''); // Clear old HCP selection
  };

  const handleHCPChange = (hcpId: string) => {
    setSelectedHCPId(hcpId);
    setSelectedProfessional(''); // Clear old HCP selection
  };

  const handleAccept = async () => {
    if (selectedStatus === 'refer-to-another-specialty') {
      if (!selectedSpecialty) {
        toast({
          title: "Required Field",
          description: "Please select a specialty.",
          variant: "destructive",
        });
        return;
      }
    } else if (!selectedTeamId && !selectedProfessional) {
      toast({
        title: "Required Field",
        description: "Please select a team or healthcare professional.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedStatus) {
      toast({
        title: "Required Field",
        description: "Please select a status.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update the referral status with team allocation
      const statusUpdated = await updateReferralStatus(
        referral.id, 
        'accepted', 
        acceptNotes,
        {
          teamId: selectedTeamId,
          assignedHCPId: selectedHCPId || selectedProfessional,
          triageStatus: selectedStatus
        }
      );
      
      // 2. Send HL7 message to EPR
      if (statusUpdated) {
        await sendHL7Message(referral.id, 'accept');
        
        let successMessage = "";
        
        if (selectedStatus === 'refer-to-another-specialty') {
          const specialty = specialties.find(s => s.id === selectedSpecialty);
          successMessage = `The referral has been accepted and referred to ${specialty?.name} specialty with status: Refer to Another Specialty.`;
        } else if (selectedTeamId) {
          const assignedTo = selectedHCPId 
            ? healthcareProfessionals.find(hp => hp.id === selectedHCPId)?.name
            : 'team';
          successMessage = `The referral has been accepted and allocated to ${assignedTo} with status: ${
            triageStatusOptions.find(s => s.value === selectedStatus)?.label
          }.`;
        } else {
          const professional = healthcareProfessionals.find(hp => hp.id === selectedProfessional);
          successMessage = `The referral has been accepted and allocated to ${professional?.name} with status: ${
            triageStatusOptions.find(s => s.value === selectedStatus)?.label
          }.`;
        }
        
        toast({
          title: "Referral Accepted",
          description: successMessage,
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

  const isFormValid = () => {
    if (!selectedStatus) return false;
    
    if (selectedStatus === 'refer-to-another-specialty') {
      return !!selectedSpecialty;
    }
    
    return !!(selectedTeamId || selectedProfessional);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full bg-success hover:bg-success/90">
          <CheckCircle className="mr-2 h-4 w-4" />
          Accept Referral
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Accept Referral</AlertDialogTitle>
          <AlertDialogDescription>
            Please allocate this referral to a team and set status.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
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

          {selectedStatus === 'refer-to-another-specialty' ? (
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
          ) : (
            <>
              <TeamSelector
                specialtyId={specialtyId}
                selectedTeamId={selectedTeamId}
                selectedHCPId={selectedHCPId}
                onTeamChange={handleTeamChange}
                onHCPChange={handleHCPChange}
              />
              
              {!selectedTeamId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Or assign directly to Healthcare Professional</label>
                  <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select professional" />
                    </SelectTrigger>
                    <SelectContent>
                      {healthcareProfessionals
                        .filter(hp => hp.specialty === specialtyId)
                        .map((professional) => (
                        <SelectItem key={professional.id} value={professional.id}>
                          {professional.name} - {professional.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

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
            disabled={isSubmitting || !isFormValid()}
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

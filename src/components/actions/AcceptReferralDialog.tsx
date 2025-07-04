import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Referral, TriageStatus } from '@/types/referral';
import { updateReferralStatus, sendHL7Message } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';
import { specialties } from '@/data/specialtyOptions';
import { fetchAllHCPs, HCP } from '@/services/hcpService';
import TeamSelector from '@/components/team/TeamSelector';
import { getSpecialtyIdByName } from '@/utils/legacySpecialtyUtils';

interface AcceptReferralDialogProps {
  referral: Referral;
  onStatusChange: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const triageStatusOptions: { value: TriageStatus; label: string }[] = [
  { value: 'pre-assessment', label: 'Pre-Assessment' },
  { value: 'assessed', label: 'Assessed' },
  { value: 'pre-admission-assessment', label: 'Pre-admission Assessment' },
  { value: 'waiting-list', label: 'Waiting List' },
  { value: 'refer-to-another-specialty', label: 'Refer to Another Specialty' },
];

const AcceptReferralDialog = ({ referral, onStatusChange, open, onOpenChange }: AcceptReferralDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  const [acceptNotes, setAcceptNotes] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<TriageStatus | ''>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedHCPId, setSelectedHCPId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [databaseHCPs, setDatabaseHCPs] = useState<HCP[]>([]);
  const [isLoadingHCPs, setIsLoadingHCPs] = useState(false);
  const { toast } = useToast();

  // Safely get specialty ID with error handling
  const specialtyId = (() => {
    try {
      console.log('AcceptReferralDialog: Getting specialty ID for:', referral.specialty);
      const id = getSpecialtyIdByName(referral.specialty);
      console.log('AcceptReferralDialog: Specialty ID resolved to:', id);
      return id;
    } catch (error) {
      console.error('AcceptReferralDialog: Error getting specialty ID:', error);
      return '';
    }
  })();
  
  // Load HCPs from database on component mount
  useEffect(() => {
    const loadHCPs = async () => {
      setIsLoadingHCPs(true);
      try {
        const hcps = await fetchAllHCPs();
        setDatabaseHCPs(hcps);
        console.log('AcceptReferralDialog: Loaded HCPs from database:', hcps.length);
      } catch (error) {
        console.error('AcceptReferralDialog: Error loading HCPs from database:', error);
      } finally {
        setIsLoadingHCPs(false);
      }
    };

    loadHCPs();
  }, []);
  
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
    console.log('AcceptReferralDialog: Team changed to:', teamId);
    setSelectedTeamId(teamId);
    setSelectedProfessional(''); // Clear old HCP selection
  };

  const handleHCPChange = (hcpId: string) => {
    console.log('AcceptReferralDialog: HCP changed to:', hcpId);
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
      // Convert "unassigned" back to empty string for the service call
      const finalHCPId = selectedHCPId === 'unassigned' ? '' : selectedHCPId;
      const finalProfessionalId = selectedProfessional === 'unassigned' ? '' : selectedProfessional;

      console.log('AcceptReferralDialog: Submitting with data:', {
        teamId: selectedTeamId,
        assignedHCPId: finalHCPId || finalProfessionalId,
        triageStatus: selectedStatus
      });

      // 1. Update the referral status with team allocation
      const statusUpdated = await updateReferralStatus(
        referral.id, 
        'accepted', 
        acceptNotes,
        {
          teamId: selectedTeamId,
          assignedHCPId: finalHCPId || finalProfessionalId,
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
          const assignedTo = (finalHCPId && finalHCPId !== 'unassigned')
            ? databaseHCPs.find(hp => hp.id === finalHCPId)?.name
            : 'team';
          successMessage = `The referral has been accepted and allocated to ${assignedTo} with status: ${
            triageStatusOptions.find(s => s.value === selectedStatus)?.label
          }.`;
        } else {
          const professional = databaseHCPs.find(hp => hp.id === finalProfessionalId);
          successMessage = `The referral has been accepted and allocated to ${professional?.name} with status: ${
            triageStatusOptions.find(s => s.value === selectedStatus)?.label
          }.`;
        }
        
        toast({
          title: "Referral Accepted",
          description: successMessage,
          variant: "default",
        });
        
        // Reset form and close sheet
        setAcceptNotes('');
        setSelectedProfessional('');
        setSelectedSpecialty('');
        setSelectedStatus('');
        setSelectedTeamId('');
        setSelectedHCPId('');
        setIsOpen(false);
        
        onStatusChange();
      } else {
        throw new Error("Failed to update referral status");
      }
    } catch (error) {
      console.error("AcceptReferralDialog: Error accepting referral:", error);
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

  // Add safety check for specialty ID
  if (!specialtyId) {
    console.warn('AcceptReferralDialog: Invalid specialty ID, cannot show team selector');
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Accept Referral</SheetTitle>
          <SheetDescription className="text-base">
            Please allocate this referral to a team and set status for {referral.patient.name}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4 space-y-6">
            <div className="space-y-4">
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
                  {specialtyId && (
                    <TeamSelector
                      specialtyId={specialtyId}
                      selectedTeamId={selectedTeamId}
                      selectedHCPId={selectedHCPId}
                      onTeamChange={handleTeamChange}
                      onHCPChange={handleHCPChange}
                    />
                  )}
                  
                  {(!specialtyId || !selectedTeamId) && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Or assign directly to Healthcare Professional</label>
                      <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select professional" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingHCPs ? (
                            <SelectItem value="loading" disabled>
                              Loading healthcare professionals...
                            </SelectItem>
                          ) : (
                            databaseHCPs
                              .filter(hcp => hcp.active !== false)
                              .map((professional) => (
                              <SelectItem key={professional.id} value={professional.id}>
                                {professional.name} - {professional.role || 'Healthcare Professional'}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  placeholder="Add optional notes (e.g., appointment details)"
                  value={acceptNotes}
                  onChange={(e) => setAcceptNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button 
                onClick={handleAccept} 
                disabled={isSubmitting || !isFormValid()}
                className="bg-success hover:bg-success/90 flex-1"
              >
                {isSubmitting ? "Processing..." : "Accept Referral"}
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

export default AcceptReferralDialog;
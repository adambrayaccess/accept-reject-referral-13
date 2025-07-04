import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, UserX, BedDouble } from 'lucide-react';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';
import { specialties } from '@/data/specialtyOptions';
import { createInpatientAdmission } from '@/services/inpatientService';

interface WaitingListActionsSheetProps {
  referral: Referral;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: () => void;
}

type ActionType = 'transfer' | 'discharge' | 'admit' | '';

const WaitingListActionsSheet = ({ referral, open, onOpenChange, onStatusChange }: WaitingListActionsSheetProps) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Mock ward data - in real implementation this would come from a service
  const availableWards = [
    { id: 'ward-a', name: 'Cardiology Ward A' },
    { id: 'ward-b', name: 'Mental Health Unit' },
    { id: 'ward-c', name: 'General Medical Ward' },
    { id: 'ward-d', name: 'Surgical Ward' },
    { id: 'ward-e', name: 'Emergency Assessment Unit' }
  ];

  const handleSubmit = async () => {
    if (!selectedAction) {
      toast({
        title: "Required Field",
        description: "Please select an action.",
        variant: "destructive",
      });
      return;
    }

    if (selectedAction === 'transfer' && !selectedSpecialty) {
      toast({
        title: "Required Field",
        description: "Please select a specialty to transfer to.",
        variant: "destructive",
      });
      return;
    }

    if (selectedAction === 'admit' && !selectedWard) {
      toast({
        title: "Required Field",
        description: "Please select a ward to admit to.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let successMessage = "";
      
      switch (selectedAction) {
        case 'transfer':
          // Mock implementation - transfer logic would go here
          await new Promise(resolve => setTimeout(resolve, 1000));
          const specialty = specialties.find(s => s.id === selectedSpecialty);
          successMessage = `Patient has been transferred to ${specialty?.name} waiting list.`;
          break;
        case 'discharge':
          // Mock implementation - discharge logic would go here
          await new Promise(resolve => setTimeout(resolve, 1000));
          successMessage = `Patient has been discharged from the waiting list.`;
          break;
        case 'admit':
          const ward = availableWards.find(w => w.id === selectedWard);
          const admissionResult = await createInpatientAdmission({
            patient_id: referral.patient.id,
            referral_id: referral.id,
            ward_name: ward?.name || '',
            admission_reason: `Admitted from ${referral.specialty} waiting list`,
            specialty: referral.specialty,
            notes: notes || undefined,
            admitted_by: 'Current User' // In real app, get from auth context
          });
          
          if (!admissionResult) {
            throw new Error('Failed to create admission record');
          }
          
          successMessage = `Patient has been admitted to ${ward?.name}.`;
          break;
      }
      
      toast({
        title: "Action Completed",
        description: successMessage,
        variant: "default",
      });
      
      // Reset form and close sheet
      setSelectedAction('');
      setSelectedSpecialty('');
      setSelectedWard('');
      setNotes('');
      onOpenChange(false);
      onStatusChange();
      
    } catch (error) {
      console.error("Error performing waiting list action:", error);
      toast({
        title: "Error",
        description: "There was a problem performing this action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionIcon = (action: ActionType) => {
    switch (action) {
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4" />;
      case 'discharge':
        return <UserX className="h-4 w-4" />;
      case 'admit':
        return <BedDouble className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const isFormValid = () => {
    if (!selectedAction) return false;
    
    switch (selectedAction) {
      case 'transfer':
        return !!selectedSpecialty;
      case 'admit':
        return !!selectedWard;
      case 'discharge':
        return true;
      default:
        return false;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Waiting List Actions</SheetTitle>
          <SheetDescription className="text-base">
            Manage waiting list status for {referral.patient.name}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Action</label>
                <Select 
                  value={selectedAction} 
                  onValueChange={(value: ActionType) => setSelectedAction(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transfer">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4" />
                        Transfer to Another Waiting List/Specialty
                      </div>
                    </SelectItem>
                    <SelectItem value="discharge">
                      <div className="flex items-center gap-2">
                        <UserX className="h-4 w-4" />
                        Discharge from Waiting List
                      </div>
                    </SelectItem>
                    <SelectItem value="admit">
                      <div className="flex items-center gap-2">
                        <BedDouble className="h-4 w-4" />
                        Admit Patient to Ward
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedAction === 'transfer' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transfer to Specialty</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties
                        .filter(s => s.name !== referral.specialty)
                        .map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedAction === 'admit' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admit to Ward</label>
                  <Select value={selectedWard} onValueChange={setSelectedWard}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWards.map((ward) => (
                        <SelectItem key={ward.id} value={ward.id}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  placeholder="Add optional notes about this action"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !isFormValid()}
                className="flex-1"
              >
                {getActionIcon(selectedAction)}
                {isSubmitting ? "Processing..." : `Confirm ${selectedAction === 'transfer' ? 'Transfer' : selectedAction === 'discharge' ? 'Discharge' : 'Admission'}`}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
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

export default WaitingListActionsSheet;
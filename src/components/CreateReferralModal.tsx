import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockPractitioners } from '@/services/mock/practitioners';
import { Referral, ReferralPriority } from '@/types/referral';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientDetailsForm from './referral-form/PatientDetailsForm';
import ClinicalDetailsForm from './referral-form/ClinicalDetailsForm';

interface CreateReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (referral: Partial<Referral>) => void;
}

const CreateReferralModal = ({ isOpen, onClose, onSubmit }: CreateReferralModalProps) => {
  const [referralId, setReferralId] = useState('');
  const [priority, setPriority] = useState<ReferralPriority>('routine');
  const [specialty, setSpecialty] = useState('');
  const [practitionerId, setPractitionerId] = useState('');
  
  const [patientName, setPatientName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [nhsNumber, setNhsNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [reason, setReason] = useState('');
  const [history, setHistory] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referralId || !specialty || !practitionerId || !patientName || !birthDate || !nhsNumber || !reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const referrer = mockPractitioners.find(p => p.id === practitionerId);
    
    if (!referrer) {
      toast({
        title: "Error",
        description: "Selected practitioner not found",
        variant: "destructive",
      });
      return;
    }

    const newReferral: Partial<Referral> = {
      id: `REF-${referralId}`,
      created: new Date().toISOString(),
      status: 'new',
      priority,
      specialty,
      referrer,
      patient: {
        id: nhsNumber,
        name: patientName,
        birthDate,
        gender,
        nhsNumber,
        address,
        phone,
      },
      clinicalInfo: {
        reason,
        history,
        diagnosis,
        medications: medications.split('\n').filter(med => med.trim()),
        allergies: allergies.split('\n').filter(allergy => allergy.trim()),
        notes,
      },
      attachments: [],
    };

    onSubmit(newReferral);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Manual Referral</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referralId">Access Group Referral ID</Label>
                <Input
                  id="referralId"
                  value={referralId}
                  onChange={(e) => setReferralId(e.target.value)}
                  placeholder="Enter referral ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: ReferralPriority) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Enter specialty"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="practitioner">Referring Practitioner</Label>
                <Select value={practitionerId} onValueChange={(value: string) => setPractitionerId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select practitioner" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPractitioners.map((practitioner) => (
                      <SelectItem key={practitioner.id} value={practitioner.id}>
                        {practitioner.name} - {practitioner.organization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient Details</TabsTrigger>
              <TabsTrigger value="clinical">Clinical Information</TabsTrigger>
            </TabsList>
            <TabsContent value="patient" className="mt-4">
              <PatientDetailsForm
                patientName={patientName}
                setPatientName={setPatientName}
                birthDate={birthDate}
                setBirthDate={setBirthDate}
                gender={gender}
                setGender={setGender}
                nhsNumber={nhsNumber}
                setNhsNumber={setNhsNumber}
                address={address}
                setAddress={setAddress}
                phone={phone}
                setPhone={setPhone}
              />
            </TabsContent>
            <TabsContent value="clinical" className="mt-4">
              <ClinicalDetailsForm
                reason={reason}
                setReason={setReason}
                history={history}
                setHistory={setHistory}
                diagnosis={diagnosis}
                setDiagnosis={setDiagnosis}
                medications={medications}
                setMedications={setMedications}
                allergies={allergies}
                setAllergies={setAllergies}
                notes={notes}
                setNotes={setNotes}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Referral</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReferralModal;

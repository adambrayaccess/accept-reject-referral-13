import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockPractitioners } from '@/services/mock/practitioners';
import { Referral, ReferralPriority, Patient } from '@/types/referral';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import PatientDetailsForm from './referral-form/PatientDetailsForm';
import ClinicalDetailsForm from './referral-form/ClinicalDetailsForm';
import { specialties } from '@/data/specialtyOptions';

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
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
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

  const handlePatientSelect = (patient: Patient | undefined) => {
    setSelectedPatient(patient);
    
    if (patient) {
      // Auto-fill all patient fields
      setPatientName(patient.name);
      setBirthDate(patient.birthDate);
      setGender(patient.gender);
      setNhsNumber(patient.nhsNumber);
      setAddress(patient.address || '');
      setPhone(patient.phone || '');
      
      toast({
        title: "Patient Selected",
        description: `${patient.name} has been selected and fields auto-filled.`,
      });
    } else {
      // Clear all fields when patient is deselected
      setPatientName('');
      setBirthDate('');
      setGender('');
      setNhsNumber('');
      setAddress('');
      setPhone('');
    }
  };

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
        id: selectedPatient?.id || nhsNumber,
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
    
    // Reset form
    setSelectedPatient(undefined);
    setReferralId('');
    setPriority('routine');
    setSpecialty('');
    setPractitionerId('');
    setPatientName('');
    setBirthDate('');
    setGender('');
    setNhsNumber('');
    setAddress('');
    setPhone('');
    setReason('');
    setHistory('');
    setDiagnosis('');
    setMedications('');
    setAllergies('');
    setNotes('');
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
                <Select value={specialty} onValueChange={(value: string) => setSpecialty(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialtyOption) => (
                      <SelectItem key={specialtyOption.id} value={specialtyOption.name}>
                        {specialtyOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          <EnhancedTabs defaultValue="patient" className="w-full">
            <EnhancedTabsList variant="grid" size="md">
              <EnhancedTabsTrigger value="patient" variant="grid" size="md">Patient Details</EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="clinical" variant="grid" size="md">Clinical Information</EnhancedTabsTrigger>
            </EnhancedTabsList>
            <EnhancedTabsContent value="patient" className="mt-4">
              <PatientDetailsForm
                selectedPatient={selectedPatient}
                onPatientSelect={handlePatientSelect}
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
            </EnhancedTabsContent>
            <EnhancedTabsContent value="clinical" className="mt-4">
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
            </EnhancedTabsContent>
          </EnhancedTabs>

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

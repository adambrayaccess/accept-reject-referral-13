import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mockPractitioners } from '@/services/mock/practitioners';
import { Referral, ReferralPriority, Patient } from '@/types/referral';
import { generateReferralId } from '@/utils/referralIdGenerator';
import ReferralBasicInfoForm from './referral-form/ReferralBasicInfoForm';
import ReferralFormTabs from './referral-form/ReferralFormTabs';
import { DocumentFile } from './referral-form/ReferralDocumentsTab';
import { ReferralCreationService, ReferralCreationData } from '@/services/referral/referralCreationService';
import { Loader2 } from 'lucide-react';

interface CreateReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (referral: Partial<Referral>) => void;
}

const CreateReferralModal = ({ isOpen, onClose, onSubmit }: CreateReferralModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [referralId, setReferralId] = useState('');
  const [priority, setPriority] = useState<ReferralPriority>('routine');
  const [specialty, setSpecialty] = useState('');
  const [practitionerId, setPractitionerId] = useState('');
  const [referralType, setReferralType] = useState('External Referral');
  
  // Patient fields
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [patientName, setPatientName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [nhsNumber, setNhsNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // GP fields
  const [gpName, setGpName] = useState('');
  const [gpPractice, setGpPractice] = useState('');
  const [gpAddress, setGpAddress] = useState('');
  const [gpPhone, setGpPhone] = useState('');
  const [gpEmail, setGpEmail] = useState('');

  // Clinical fields
  const [reason, setReason] = useState('');
  const [history, setHistory] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');

  // Documents
  const [documents, setDocuments] = useState<DocumentFile[]>([]);

  const { toast } = useToast();

  // Auto-generate referral ID when modal opens
  useEffect(() => {
    if (isOpen && !referralId) {
      setReferralId(generateReferralId());
    }
  }, [isOpen, referralId]);

  const handlePatientSelect = (patient: Patient | undefined) => {
    setSelectedPatient(patient);
    
    if (patient) {
      // Auto-fill patient fields
      setPatientName(patient.name);
      setBirthDate(patient.birthDate);
      setGender(patient.gender || '');
      setNhsNumber(patient.nhsNumber);
      setAddress(patient.address || '');
      setPhone(patient.phone || '');
      
      // Auto-fill GP fields if available
      if (patient.gpDetails) {
        setGpName(patient.gpDetails.name);
        setGpPractice(patient.gpDetails.practice);
        setGpAddress(patient.gpDetails.address);
        setGpPhone(patient.gpDetails.phone);
        setGpEmail(patient.gpDetails.email || '');
      }
      
      toast({
        title: "Patient Selected",
        description: `${patient.name} has been selected and fields auto-filled.`,
      });
    } else {
      // Clear all fields
      setPatientName('');
      setBirthDate('');
      setGender('');
      setNhsNumber('');
      setAddress('');
      setPhone('');
      setGpName('');
      setGpPractice('');
      setGpAddress('');
      setGpPhone('');
      setGpEmail('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsCreating(true);

    try {
      // Prepare patient data
      const patientData: Patient = {
        id: selectedPatient?.id || nhsNumber,
        name: patientName,
        birthDate,
        gender,
        nhsNumber,
        address,
        phone,
        gpDetails: gpName ? {
          id: `GP-${referralId}`,
          name: gpName,
          practice: gpPractice,
          address: gpAddress,
          phone: gpPhone,
          email: gpEmail
        } : undefined,
      };

      // Create attachments from documents
      const attachments = documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        contentType: doc.file.type,
        size: doc.file.size,
        date: new Date().toISOString(),
        url: URL.createObjectURL(doc.file) // Temporary URL for demo
      }));

      // Prepare referral creation data
      const creationData: ReferralCreationData = {
        priority,
        specialty,
        practitionerId,
        patient: patientData,
        reason,
        history,
        diagnosis,
        medications: medications.split('\n').filter(med => med.trim()),
        allergies: allergies.split('\n').filter(allergy => allergy.trim()),
        notes,
        attachments,
        aiGenerated: false,
        referralType
      };

      // Create referral using enhanced service
      const result = await ReferralCreationService.createReferral(creationData);

      if (result.success && result.referral) {
        toast({
          title: "Referral Created",
          description: `Referral ${result.referral.ubrn} has been created successfully.`,
        });
        
        onSubmit(result.referral);
        onClose();
        resetForm();
      } else {
        toast({
          title: "Creation Failed",
          description: result.error || "Failed to create referral",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating referral:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while creating the referral",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient(undefined);
    setReferralId('');
    setPriority('routine');
    setSpecialty('');
    setPractitionerId('');
    setReferralType('External Referral');
    setPatientName('');
    setBirthDate('');
    setGender('');
    setNhsNumber('');
    setAddress('');
    setPhone('');
    setGpName('');
    setGpPractice('');
    setGpAddress('');
    setGpPhone('');
    setGpEmail('');
    setReason('');
    setHistory('');
    setDiagnosis('');
    setMedications('');
    setAllergies('');
    setNotes('');
    setDocuments([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Manual Referral - Phase 3 Enhanced</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ReferralBasicInfoForm
            referralId={referralId}
            setReferralId={setReferralId}
            priority={priority}
            setPriority={setPriority}
            specialty={specialty}
            setSpecialty={setSpecialty}
            practitionerId={practitionerId}
            setPractitionerId={setPractitionerId}
            referralType={referralType}
            setReferralType={setReferralType}
          />

          <ReferralFormTabs
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
            gpName={gpName}
            setGpName={setGpName}
            gpPractice={gpPractice}
            setGpPractice={setGpPractice}
            gpAddress={gpAddress}
            setGpAddress={setGpAddress}
            gpPhone={gpPhone}
            setGpPhone={setGpPhone}
            gpEmail={gpEmail}
            setGpEmail={setGpEmail}
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
            documents={documents}
            setDocuments={setDocuments}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Referral...
                </>
              ) : (
                'Create Referral'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReferralModal;

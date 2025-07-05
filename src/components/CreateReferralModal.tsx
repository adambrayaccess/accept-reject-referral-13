import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mockPractitioners } from '@/services/mock/practitioners';
import { fetchPractitionerById } from '@/services/practitionerService';
import { createPatient } from '@/services/patientService';
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
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
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
  const [administrativeCategory, setAdministrativeCategory] = useState('');
  const [overseasStatus, setOverseasStatus] = useState('');
  const [patientAreaCareSetting, setPatientAreaCareSetting] = useState('');

  // GP fields
  const [selectedGP, setSelectedGP] = useState<Patient['gpDetails'] | undefined>();
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

  const handleGPSelect = (gp: Patient['gpDetails'] | undefined) => {
    setSelectedGP(gp);
    
    if (gp) {
      // Auto-fill GP fields from selected GP
      setGpName(gp.name);
      setGpPractice(gp.practice);
      setGpAddress(gp.address);
      setGpPhone(gp.phone);
      setGpEmail(gp.email || '');
    } else {
      // Clear GP fields when no GP is selected
      setGpName('');
      setGpPractice('');
      setGpAddress('');
      setGpPhone('');
      setGpEmail('');
    }
  };

  const handleCreateNewPatient = async () => {
    if (!patientName || !birthDate || !nhsNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in patient name, date of birth, and NHS number to create a new patient.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingPatient(true);
    try {
      const newPatientData: Omit<Patient, 'id'> = {
        name: patientName,
        birthDate,
        gender,
        nhsNumber,
        address,
        phone,
        active: true
      };

      const createdPatient = await createPatient(newPatientData);
      
      if (createdPatient) {
        setSelectedPatient(createdPatient);
        toast({
          title: "Patient Created",
          description: `${createdPatient.name} has been created and selected.`,
        });
      } else {
        toast({
          title: "Creation Failed",
          description: "Failed to create patient. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Creation Error",
        description: "An error occurred while creating the patient.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPatient(false);
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

    const practitioner = await fetchPractitionerById(practitionerId);
    
    if (!practitioner) {
      toast({
        title: "Error",
        description: "Selected practitioner not found",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // If no patient is selected but we have patient data, create a new patient first
      let patientToUse = selectedPatient;
      
      if (!selectedPatient && patientName && birthDate && nhsNumber) {
        setIsCreatingPatient(true);
        const newPatientData: Omit<Patient, 'id'> = {
          name: patientName,
          birthDate,
          gender,
          nhsNumber,
          address,
          phone,
          active: true
        };

        patientToUse = await createPatient(newPatientData);
        setIsCreatingPatient(false);
        
        if (!patientToUse) {
          toast({
            title: "Patient Creation Failed",
            description: "Could not create patient record. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      if (!patientToUse) {
        toast({
          title: "Patient Required",
          description: "Please select an existing patient or provide patient details to create a new one.",
          variant: "destructive",
        });
        return;
      }

      // Prepare patient data
      const patientData: Patient = patientToUse;

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
      setIsCreatingPatient(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient(undefined);
    setSelectedGP(undefined);
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
    setAdministrativeCategory('');
    setOverseasStatus('');
    setPatientAreaCareSetting('');
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Create Referral</SheetTitle>
        </SheetHeader>
        
        <div className="relative flex-1 flex flex-col">
          <ScrollArea className="flex-1 pb-20">
            <div className="pr-4">
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
                  practitionerId={practitionerId}
                  setPractitionerId={setPractitionerId}
                  selectedPatient={selectedPatient}
                  onPatientSelect={handlePatientSelect}
                  onCreateNewPatient={handleCreateNewPatient}
                  isCreatingPatient={isCreatingPatient}
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
                  administrativeCategory={administrativeCategory}
                  setAdministrativeCategory={setAdministrativeCategory}
                  overseasStatus={overseasStatus}
                  setOverseasStatus={setOverseasStatus}
                  patientAreaCareSetting={patientAreaCareSetting}
                  setPatientAreaCareSetting={setPatientAreaCareSetting}
                  selectedGP={selectedGP}
                  onGPSelect={handleGPSelect}
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
              </form>
            </div>
          </ScrollArea>
          
          {/* Fixed buttons at bottom right */}
          <div className="absolute bottom-0 right-0 p-4 bg-background border-t">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isCreating || isCreatingPatient}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isCreating || isCreatingPatient}>
                {isCreating || isCreatingPatient ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isCreatingPatient ? 'Creating Patient...' : 'Creating Referral...'}
                  </>
                ) : (
                  'Create Referral'
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateReferralModal;

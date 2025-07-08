import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchPractitionerById } from '@/services/practitionerService';
import { createPatient } from '@/services/patientService';
import { Referral, ReferralPriority, Patient } from '@/types/referral';
import { generateReferralId } from '@/utils/referralIdGenerator';
import ReferralBasicInfoForm from '../referral-form/ReferralBasicInfoForm';
import ReferralFormTabs from '../referral-form/ReferralFormTabs';
import { DocumentFile } from '../referral-form/ReferralDocumentsTab';
import { ReferralCreationService, ReferralCreationData } from '@/services/referral/referralCreationService';
import { useNotificationService } from '@/services/notificationService';

interface CreateReferralFormProps {
  onSubmit: (referral: Partial<Referral>) => void;
  onClose: () => void;
  isCreating: boolean;
  setIsCreating: (creating: boolean) => void;
  isCreatingPatient: boolean;
  setIsCreatingPatient: (creating: boolean) => void;
  onFormSubmitReady: (handler: () => void) => void;
}

const CreateReferralForm = ({
  onSubmit,
  onClose,
  isCreating,
  setIsCreating,
  isCreatingPatient,
  setIsCreatingPatient,
  onFormSubmitReady
}: CreateReferralFormProps) => {
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

  const { showError } = useNotificationService();

  // Auto-generate referral ID
  useEffect(() => {
    if (!referralId) {
      setReferralId(generateReferralId());
    }
  }, [referralId]);

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
      showError(
        "Missing Information",
        "Please fill in patient name, date of birth, and NHS number to create a new patient."
      );
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
      } else {
        showError(
          "Creation Failed",
          "Failed to create patient. Please try again."
        );
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      showError(
        "Creation Error",
        "An error occurred while creating the patient."
      );
    } finally {
      setIsCreatingPatient(false);
    }
  };

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!referralId || !specialty || !practitionerId || !patientName || !birthDate || !nhsNumber || !reason) {
      showError(
        "Validation Error",
        "Please fill in all required fields"
      );
      return;
    }

    const practitioner = await fetchPractitionerById(practitionerId);
    
    if (!practitioner) {
      showError(
        "Error",
        "Selected practitioner not found"
      );
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
          showError(
            "Patient Creation Failed",
            "Could not create patient record. Please try again."
          );
          return;
        }
      }

      if (!patientToUse) {
        showError(
          "Patient Required",
          "Please select an existing patient or provide patient details to create a new one."
        );
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
        referralType,
        administrativeCategory,
        overseasStatus,
        patientAreaCareSetting
      };

      // Create referral using enhanced service
      const result = await ReferralCreationService.createReferral(creationData);

      if (result.success && result.referral) {
        
        onSubmit(result.referral);
        onClose();
        resetForm();
      } else {
        showError(
          "Creation Failed",
          result.error || "Failed to create referral"
        );
      }
    } catch (error) {
      console.error('Error creating referral:', error);
      showError(
        "Unexpected Error",
        "An unexpected error occurred while creating the referral"
      );
    } finally {
      setIsCreating(false);
      setIsCreatingPatient(false);
    }
  }, [referralId, specialty, practitionerId, patientName, birthDate, nhsNumber, reason, selectedPatient, gender, address, phone, medications, allergies, notes, documents, priority, history, diagnosis, referralType, administrativeCategory, overseasStatus, patientAreaCareSetting, onSubmit, onClose, showError]);

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

  // Pass handleSubmit to parent component
  useEffect(() => {
    onFormSubmitReady(() => handleSubmit());
  }, [onFormSubmitReady, handleSubmit]);

  return (
    <div className="p-6 space-y-6">
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
    </div>
  );
};

export default CreateReferralForm;
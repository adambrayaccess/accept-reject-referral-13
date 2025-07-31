import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedPatientDetailsForm from './EnhancedPatientDetailsForm';
import GPDetailsForm from './GPDetailsForm';
import EnhancedClinicalDetailsForm from './EnhancedClinicalDetailsForm';
import ReferralDocumentsTab, { DocumentFile } from './ReferralDocumentsTab';
import { Patient } from '@/types/patient';

interface ReferralFormTabsProps {
  // Practitioner field
  practitionerId: string;
  setPractitionerId: (value: string) => void;
  
  // Patient fields
  selectedPatient: Patient | undefined;
  onPatientSelect: (patient: Patient | undefined) => void;
  onCreateNewPatient?: () => void;
  isCreatingPatient?: boolean;
  patientName: string;
  setPatientName: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  nhsNumber: string;
  setNhsNumber: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  administrativeCategory: string;
  setAdministrativeCategory: (value: string) => void;
  overseasStatus: string;
  setOverseasStatus: (value: string) => void;
  patientAreaCareSetting: string;
  setPatientAreaCareSetting: (value: string) => void;
  
  // GP fields
  selectedGP?: Patient['gpDetails'];
  onGPSelect: (gp: Patient['gpDetails'] | undefined) => void;
  gpName: string;
  setGpName: (value: string) => void;
  gpPractice: string;
  setGpPractice: (value: string) => void;
  gpAddress: string;
  setGpAddress: (value: string) => void;
  gpPhone: string;
  setGpPhone: (value: string) => void;
  gpEmail: string;
  setGpEmail: (value: string) => void;
  
  // Clinical fields
  reason: string;
  setReason: (value: string) => void;
  history: string;
  setHistory: (value: string) => void;
  diagnosis: string;
  setDiagnosis: (value: string) => void;
  medications: string;
  setMedications: (value: string) => void;
  allergies: string;
  setAllergies: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  
  // Documents
  documents: DocumentFile[];
  setDocuments: (documents: DocumentFile[]) => void;
}

const ReferralFormTabs = ({
  practitionerId,
  setPractitionerId,
  selectedPatient,
  onPatientSelect,
  onCreateNewPatient,
  isCreatingPatient = false,
  patientName,
  setPatientName,
  birthDate,
  setBirthDate,
  gender,
  setGender,
  nhsNumber,
  setNhsNumber,
  address,
  setAddress,
  phone,
  setPhone,
  administrativeCategory,
  setAdministrativeCategory,
  overseasStatus,
  setOverseasStatus,
  patientAreaCareSetting,
  setPatientAreaCareSetting,
  selectedGP,
  onGPSelect,
  gpName,
  setGpName,
  gpPractice,
  setGpPractice,
  gpAddress,
  setGpAddress,
  gpPhone,
  setGpPhone,
  gpEmail,
  setGpEmail,
  reason,
  setReason,
  history,
  setHistory,
  diagnosis,
  setDiagnosis,
  medications,
  setMedications,
  allergies,
  setAllergies,
  notes,
  setNotes,
  documents,
  setDocuments,
}: ReferralFormTabsProps) => {
  return (
    <Tabs defaultValue="patient" className="w-full">
      <TabsList variant="grid" size="md">
        <TabsTrigger value="patient" variant="grid" size="md">Patient Details</TabsTrigger>
        <TabsTrigger value="gp" variant="grid" size="md">Referrer</TabsTrigger>
        <TabsTrigger value="clinical" variant="grid" size="md">Clinical Information</TabsTrigger>
        <TabsTrigger value="documents" variant="grid" size="md">Documents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="patient" className="mt-4">
        <EnhancedPatientDetailsForm
          selectedPatient={selectedPatient}
          onPatientSelect={onPatientSelect}
          onCreateNewPatient={onCreateNewPatient}
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
        />
      </TabsContent>
      
      <TabsContent value="gp" className="mt-4">
        <GPDetailsForm
          practitionerId={practitionerId}
          setPractitionerId={setPractitionerId}
          selectedGP={selectedGP}
          onGPSelect={onGPSelect}
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
          selectedPatientGP={selectedPatient?.gpDetails}
        />
      </TabsContent>
      
      <TabsContent value="clinical" className="mt-4">
        <EnhancedClinicalDetailsForm
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
          selectedPatient={selectedPatient}
        />
      </TabsContent>
      
      <TabsContent value="documents" className="mt-4">
        <ReferralDocumentsTab
          documents={documents}
          setDocuments={setDocuments}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ReferralFormTabs;
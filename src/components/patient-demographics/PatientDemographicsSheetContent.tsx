
import { Patient } from '@/types/patient';
import { usePatientDemographics } from '@/hooks/usePatientDemographics';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import PatientSummaryCard from './PatientSummaryCard';
import ClinicalAlertsCard from './ClinicalAlertsCard';
import GPDetailsCard from './GPDetailsCard';
import DemographicDetailsCard from './DemographicDetailsCard';
import PharmacyDetailsCard from './PharmacyDetailsCard';
import RelatedPeopleCard from './RelatedPeopleCard';
import AccessRestrictionCard from './AccessRestrictionCard';
import HistoricAddressesCard from './HistoricAddressesCard';
import RecordInformationCard from './RecordInformationCard';
import PatientDemographicsAllergies from './PatientDemographicsAllergies';
import PatientDemographicsAdjustments from './PatientDemographicsAdjustments';
import MedicalHistoryCard from './MedicalHistoryCard';

interface PatientDemographicsSheetContentProps {
  patientId: string;
}

const PatientDemographicsSheetContent = ({ patientId }: PatientDemographicsSheetContentProps) => {
  const { patient, isLoading, error } = usePatientDemographics(patientId);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-6">
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-24" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Failed to load patient demographics'}
        </AlertDescription>
      </Alert>
    );
  }

  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
  const hasAllergies = patient.medicalHistory?.allergies && patient.medicalHistory.allergies.length > 0;
  const hasAdjustments = patient.reasonableAdjustments?.hasAdjustments;
  const hasAccessRestriction = patient.accessRestriction?.isRestricted;
  const hasMedicalHistory = patient.medicalHistory?.vitalSigns?.length > 0 || 
                           patient.medications?.length > 0 || 
                           patient.testResults?.length > 0 ||
                           patient.mhaSections?.length > 0;

  return (
    <div className="space-y-6 pb-6">
      <PatientSummaryCard patient={patient} age={age} />
      
      <ClinicalAlertsCard patient={patient} />

      <DemographicDetailsCard patient={patient} age={age} />
      
      {hasAccessRestriction && (
        <AccessRestrictionCard patient={patient} />
      )}
      
      {/* Phase 2: Enhanced Medical History Integration */}
      {hasMedicalHistory && (
        <MedicalHistoryCard patient={patient} />
      )}
      
      <GPDetailsCard patient={patient} />
      
      <PharmacyDetailsCard patient={patient} />
            
      <RelatedPeopleCard patient={patient} />
      
      {hasAllergies && (
        <PatientDemographicsAllergies allergies={patient.medicalHistory!.allergies!} />
      )}
      
      {hasAdjustments && (
        <PatientDemographicsAdjustments adjustmentsFlag={patient.reasonableAdjustments!} />
      )}
      
      <HistoricAddressesCard patient={patient} />
      
      <RecordInformationCard patient={patient} />
    </div>
  );
};

export default PatientDemographicsSheetContent;

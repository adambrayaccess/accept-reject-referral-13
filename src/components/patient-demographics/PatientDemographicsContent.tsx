
import { Patient } from '@/types/patient';
import PatientSummaryCard from './PatientSummaryCard';
import ClinicalAlertsCard from './ClinicalAlertsCard';
import GPDetailsCard from './GPDetailsCard';
import DemographicDetailsCard from './DemographicDetailsCard';
import RecordInformationCard from './RecordInformationCard';
import PatientDemographicsAllergies from './PatientDemographicsAllergies';
import PatientDemographicsAdjustments from './PatientDemographicsAdjustments';

interface PatientDemographicsContentProps {
  patient: Patient;
}

const PatientDemographicsContent = ({ patient }: PatientDemographicsContentProps) => {
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
  const hasAllergies = patient.medicalHistory?.allergies && patient.medicalHistory.allergies.length > 0;
  const hasAdjustments = patient.reasonableAdjustments?.hasAdjustments;

  return (
    <div className="space-y-6 pb-6">
      <PatientSummaryCard patient={patient} age={age} />
      
      <ClinicalAlertsCard patient={patient} />
      
      <GPDetailsCard patient={patient} />
      
      <DemographicDetailsCard patient={patient} age={age} />
      
      {hasAllergies && (
        <PatientDemographicsAllergies allergies={patient.medicalHistory!.allergies!} />
      )}
      
      {hasAdjustments && (
        <PatientDemographicsAdjustments adjustmentsFlag={patient.reasonableAdjustments!} />
      )}
      
      <RecordInformationCard patient={patient} />
    </div>
  );
};

export default PatientDemographicsContent;

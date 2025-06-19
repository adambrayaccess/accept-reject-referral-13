
import { Patient } from '@/types/patient';
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

interface PatientDemographicsContentProps {
  patient: Patient;
}

const PatientDemographicsContent = ({ patient }: PatientDemographicsContentProps) => {
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
  const hasAllergies = patient.medicalHistory?.allergies && patient.medicalHistory.allergies.length > 0;
  const hasAdjustments = patient.reasonableAdjustments?.hasAdjustments;
  const hasAccessRestriction = patient.accessRestriction?.isRestricted;

  return (
    <div className="space-y-6 pb-6">
      <PatientSummaryCard patient={patient} age={age} />
      
      <ClinicalAlertsCard patient={patient} />
      
      {hasAccessRestriction && (
        <AccessRestrictionCard patient={patient} />
      )}
      
      <GPDetailsCard patient={patient} />
      
      <PharmacyDetailsCard patient={patient} />
      
      <DemographicDetailsCard patient={patient} age={age} />
      
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

export default PatientDemographicsContent;

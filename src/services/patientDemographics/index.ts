
import { Patient } from '@/types/patient';
import { fetchPatientFromDatabase, fetchRelatedPatientData } from './patientDataFetcher';
import { transformPatientData } from './patientDataTransformer';

export const fetchPatientDemographics = async (patientId: string): Promise<Patient | null> => {
  try {
    console.log(`Fetching patient demographics for ID: ${patientId}`);
    
    // Fetch patient with all related data from database
    const patient = await fetchPatientFromDatabase(patientId);
    const relatedData = await fetchRelatedPatientData(patientId);

    // Transform the data to match our Patient interface
    const transformedPatient = transformPatientData(
      patient,
      relatedData.gpDetails,
      relatedData.relatedPeople,
      relatedData.historicAddresses,
      relatedData.pharmacies,
      relatedData.allergies,
      relatedData.reasonableAdjustments
    );

    return transformedPatient;
  } catch (error) {
    console.error('Error in fetchPatientDemographics:', error);
    return null;
  }
};

// Re-export individual functions for direct use if needed
export { fetchPatientFromDatabase, fetchRelatedPatientData } from './patientDataFetcher';
export { transformPatientData } from './patientDataTransformer';

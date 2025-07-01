
import { Patient } from '@/types/patient';
import { isValidUUID } from './uuidValidator';
import { getMockPatientData } from './mockPatientData';
import { fetchPatientFromDatabase, fetchRelatedPatientData } from './patientDataFetcher';
import { transformPatientData } from './patientDataTransformer';

export const fetchPatientDemographics = async (patientId: string): Promise<Patient | null> => {
  try {
    // If the patientId is not a valid UUID, fall back to mock data
    if (!isValidUUID(patientId)) {
      console.log(`Patient ID ${patientId} is not a valid UUID, using mock data`);
      return getMockPatientData(patientId);
    }

    // Fetch patient with all related data
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
    console.log(`Falling back to mock data for patient ${patientId}`);
    return getMockPatientData(patientId);
  }
};

// Re-export individual functions for direct use if needed
export { getMockPatientData } from './mockPatientData';
export { isValidUUID } from './uuidValidator';
export { fetchPatientFromDatabase, fetchRelatedPatientData } from './patientDataFetcher';
export { transformPatientData } from './patientDataTransformer';

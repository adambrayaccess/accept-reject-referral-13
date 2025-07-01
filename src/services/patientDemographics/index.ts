
import { Patient } from '@/types/patient';
import { fetchPatientFromDatabase, fetchRelatedPatientData } from './patientDataFetcher';
import { transformPatientData } from './patientDataTransformer';

export const fetchPatientDemographics = async (patientId: string): Promise<Patient | null> => {
  try {
    console.log(`🚀 Phase 2: Fetching comprehensive patient demographics for ID: ${patientId}`);
    
    // Fetch patient with all related data from database
    const patient = await fetchPatientFromDatabase(patientId);
    const relatedData = await fetchRelatedPatientData(patientId);

    console.log('📊 Phase 2: Data Integration Summary:');
    console.log(`   - Allergies: ${relatedData.allergies?.length || 0}`);
    console.log(`   - Vital Signs: ${relatedData.vitalSigns?.length || 0}`);
    console.log(`   - Medications: ${relatedData.medications?.length || 0}`);
    console.log(`   - Test Results: ${relatedData.testResults?.length || 0}`);
    console.log(`   - MHA Sections: ${relatedData.mhaSections?.length || 0}`);
    console.log(`   - Related People: ${relatedData.relatedPeople?.length || 0}`);
    console.log(`   - Historic Addresses: ${relatedData.historicAddresses?.length || 0}`);
    console.log(`   - Reasonable Adjustments: ${relatedData.reasonableAdjustments ? 'Yes' : 'No'}`);

    // Transform the data to match our Patient interface (Phase 2 enhanced)
    const transformedPatient = transformPatientData(
      patient,
      relatedData.gpDetails,
      relatedData.relatedPeople,
      relatedData.historicAddresses,
      relatedData.pharmacies,
      relatedData.allergies,
      relatedData.reasonableAdjustments,
      // Phase 2: Medical History Data
      relatedData.vitalSigns,
      relatedData.medications,
      relatedData.testResults,
      relatedData.mhaSections
    );

    console.log('✅ Phase 2: Patient demographics with comprehensive medical data loaded successfully');
    return transformedPatient;
  } catch (error) {
    console.error('❌ Phase 2: Error in fetchPatientDemographics:', error);
    return null;
  }
};

// Re-export individual functions for direct use if needed
export { fetchPatientFromDatabase, fetchRelatedPatientData } from './patientDataFetcher';
export { transformPatientData } from './patientDataTransformer';

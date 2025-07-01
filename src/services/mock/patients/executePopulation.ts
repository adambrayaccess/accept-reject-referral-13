
import { PatientPopulationService } from './patientPopulationService';

/**
 * Execute the patient population plan
 * This function can be called from the console or integrated into the application
 */
export async function executePatientPopulation() {
  console.log('🎯 Starting Patient Population Execution');
  console.log('📋 Plan: Add 15 new patients with comprehensive data');
  console.log('🔄 This will populate all database tables with realistic data');
  
  try {
    // Step 1: Validate prerequisites
    console.log('\n🔍 Step 1: Validating prerequisites...');
    const prerequisites = await PatientPopulationService.validatePrerequisites();
    
    if (!prerequisites.allPassed) {
      console.error('❌ Prerequisites not met. Cannot proceed.');
      return { success: false, error: 'Prerequisites validation failed' };
    }

    // Step 2: Check current database state
    console.log('\n📊 Step 2: Checking current database state...');
    const dbState = await PatientPopulationService.checkDatabaseState();
    
    if (dbState.error) {
      console.error('❌ Cannot check database state:', dbState.error);
      return { success: false, error: dbState.error };
    }

    // Step 3: Execute population plan
    console.log('\n🚀 Step 3: Executing population plan...');
    const result = await PatientPopulationService.executePopulationPlan();
    
    if (result.success) {
      console.log('\n🎉 SUCCESS! Patient population completed.');
      console.log('📊 Results Summary:');
      console.log(`   - Patients Generated: ${result.patientsGenerated}`);
      console.log(`   - Database Records: ${result.databaseInsertion.successful}/${result.databaseInsertion.totalPatients}`);
      console.log(`   - FHIR Synchronized: ${result.fhirSync?.successful || 0}/${result.fhirSync?.attempted || 0}`);
      console.log(`   - Duration: ${Math.round(result.duration / 1000)}s`);
      
      return { success: true, result };
    } else {
      console.error('\n❌ FAILED! Patient population encountered errors.');
      console.error('Error:', result.error);
      
      return { success: false, error: result.error, result };
    }
    
  } catch (error) {
    console.error('\n💥 EXCEPTION during patient population:', error);
    return { success: false, error: error.message };
  }
}

// Auto-execute if this file is run directly
if (typeof window !== 'undefined') {
  // Browser environment - expose to global scope for console usage
  (window as any).executePatientPopulation = executePatientPopulation;
  console.log('📋 Patient Population Plan loaded. Run executePatientPopulation() to start.');
}

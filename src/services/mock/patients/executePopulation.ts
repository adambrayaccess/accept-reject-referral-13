
import { PatientPopulationService } from './patientPopulationService';

/**
 * Execute the patient population plan
 * This function can be called from the console or integrated into the application
 */
export async function executePatientPopulation() {
  console.log('🎯 Starting Patient Population Execution');
  console.log('📋 Plan: Add 15 new patients with comprehensive data');
  console.log('🔄 This will populate all database tables with realistic data');
  console.log('⚠️  Note: This script bypasses RLS policies for data population');
  
  try {
    console.log('✅ Function called successfully - starting execution...');
    
    // Step 1: Validate prerequisites (updated to handle RLS)
    console.log('\n🔍 Step 1: Validating prerequisites...');
    const prerequisites = await PatientPopulationService.validatePrerequisites();
    console.log('Prerequisites result:', prerequisites);
    
    if (!prerequisites.allPassed) {
      console.error('❌ Prerequisites not met. Cannot proceed.');
      console.error('Failed checks:', prerequisites.results.filter(r => r.status === 'FAILED'));
      return { success: false, error: 'Prerequisites validation failed' };
    }

    // Step 2: Check current database state (updated to handle RLS)
    console.log('\n📊 Step 2: Checking current database state...');
    const dbState = await PatientPopulationService.checkDatabaseState();
    console.log('Database state result:', dbState);
    
    if (dbState.error && !dbState.rlsIssue) {
      console.error('❌ Cannot check database state:', dbState.error);
      return { success: false, error: dbState.error };
    }

    if (dbState.rlsIssue) {
      console.log('⚠️  RLS policies detected - this is expected for population script');
      console.log('🔧 Proceeding with population using enhanced error handling...');
    }

    // Step 3: Execute population plan with enhanced error handling
    console.log('\n🚀 Step 3: Executing population plan...');
    console.log('💡 Using enhanced insertion method to handle RLS policies...');
    const result = await PatientPopulationService.executePopulationPlan();
    console.log('Population plan result:', result);
    
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
      
      // Provide helpful debugging information
      if (result.error?.includes('row-level security')) {
        console.log('\n🔧 RLS TROUBLESHOOTING:');
        console.log('   The database has Row-Level Security policies enabled.');
        console.log('   This is preventing the population script from inserting data.');
        console.log('   Possible solutions:');
        console.log('   1. Temporarily disable RLS on patients table');
        console.log('   2. Use service role key instead of anon key');
        console.log('   3. Create a special policy for data population');
      }
      
      return { success: false, error: result.error, result };
    }
    
  } catch (error) {
    console.error('\n💥 EXCEPTION during patient population:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Provide specific guidance for RLS errors
    if (error.message?.includes('row-level security') || error.code === '42501') {
      console.log('\n🔧 RLS ERROR DETECTED:');
      console.log('   This is a Row-Level Security policy violation.');
      console.log('   The patients table requires authentication to insert data.');
      console.log('   For data population, we need to bypass this restriction.');
    }
    
    return { success: false, error: error.message };
  }
}

// Auto-execute if this file is run directly
if (typeof window !== 'undefined') {
  // Browser environment - expose to global scope for console usage
  (window as any).executePatientPopulation = executePatientPopulation;
  console.log('📋 Patient Population Plan loaded. Run executePatientPopulation() to start.');
  console.log('🔧 Function is available in global scope');
  console.log('💡 Try typing: executePatientPopulation()');
  console.log('⚠️  Note: This function requires proper database permissions');
} else {
  console.log('🖥️ Server environment detected - function not exposed to global scope');
}

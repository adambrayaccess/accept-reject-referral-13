
import { executePhase2MedicalData } from './executePhase2';

/**
 * Phase 2 Launcher - Medical History & Clinical Data Population
 * This is the entry point for Phase 2 execution
 */
console.log('🏥 Phase 2 Launcher: Medical History & Clinical Data Population');
console.log('📋 Initializing medical data population system...');

// Execute Phase 2 automatically
executePhase2MedicalData()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 PHASE 2 EXECUTION COMPLETED SUCCESSFULLY!');
      console.log(`📊 Populated ${result.patientsPopulated} patients with comprehensive medical data`);
      console.log(`📈 Medical tables populated: ${result.medicalDataTables?.length || 0}`);
      
      if (result.duration) {
        console.log(`⏱️ Execution time: ${Math.round(result.duration / 1000)}s`);
      }
      
      console.log('\n✅ Medical History & Clinical Data Population Complete!');
      console.log('🔍 Check the database to see the populated medical records.');
    } else {
      console.error('\n❌ PHASE 2 EXECUTION FAILED');
      console.error('Error:', result.error);
      
      console.log('\n🔧 Next Steps:');
      console.log('1. Check database connectivity');
      console.log('2. Verify RLS policies are configured correctly');
      console.log('3. Ensure proper authentication is in place');
    }
  })
  .catch(error => {
    console.error('\n💥 PHASE 2 LAUNCHER ERROR:', error);
    console.error('Failed to execute Phase 2 medical data population');
  });

// Make functions available globally for manual execution
if (typeof window !== 'undefined') {
  (window as any).launchPhase2 = executePhase2MedicalData;
  console.log('\n💡 Manual execution available: launchPhase2()');
}

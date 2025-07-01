
import { executePatientPopulation } from './executePopulation';

/**
 * Execute Phase 2: Medical History & Clinical Data Population
 * This specifically focuses on populating comprehensive medical records
 */
export async function executePhase2MedicalData() {
  console.log('🏥 PHASE 2: Medical History & Clinical Data Population');
  console.log('📋 This phase will populate:');
  console.log('   - Vital Signs (NEWS2, Temperature, Heart Rate, etc.)');
  console.log('   - Medication History (Active prescriptions)');
  console.log('   - Test Results (Blood tests, Imaging, etc.)');
  console.log('   - Allergies & Reactions');
  console.log('   - Reasonable Adjustments');
  console.log('   - GP & Pharmacy Details');
  console.log('   - Related People & Historic Addresses');
  
  try {
    console.log('\n🚀 Starting comprehensive medical data population...');
    const result = await executePatientPopulation();
    
    if (result.success) {
      console.log('\n✅ PHASE 2 COMPLETED SUCCESSFULLY!');
      console.log('📊 Medical Data Population Summary:');
      
      if (result.result?.databaseInsertion) {
        const insertion = result.result.databaseInsertion;
        console.log(`   📈 Total Patients: ${insertion.totalPatients}`);
        console.log(`   ✅ Successfully Inserted: ${insertion.successful}`);
        console.log(`   ❌ Failed Insertions: ${insertion.failed}`);
        console.log(`   📋 Success Rate: ${Math.round((insertion.successful / insertion.totalPatients) * 100)}%`);
        
        if (insertion.tableStats) {
          console.log('\n📊 Detailed Medical Data Population:');
          Object.entries(insertion.tableStats).forEach(([table, stats]) => {
            const medicalTables = [
              'vital_signs', 'medications', 'test_results', 'allergies',
              'reasonable_adjustments', 'gp_details', 'pharmacy_details',
              'related_people', 'historic_addresses'
            ];
            
            if (medicalTables.includes(table)) {
              console.log(`   🏥 ${table}: ${stats.successful}/${stats.attempted} records`);
            }
          });
        }
      }
      
      if (result.result?.fhirSync) {
        console.log('\n🔄 FHIR Synchronization:');
        console.log(`   📤 Attempted: ${result.result.fhirSync.attempted}`);
        console.log(`   ✅ Successful: ${result.result.fhirSync.successful}`);
        console.log(`   ❌ Failed: ${result.result.fhirSync.failed}`);
      }
      
      console.log('\n🎯 Phase 2 Medical Data Features:');
      console.log('   ✓ Realistic vital signs with NEWS2 scoring');
      console.log('   ✓ Evidence-based medication prescriptions');
      console.log('   ✓ Comprehensive test results with normal/abnormal flags');
      console.log('   ✓ Detailed allergy profiles with severity levels');
      console.log('   ✓ Accessibility adjustments and flag levels');
      console.log('   ✓ Complete contact and address history');
      console.log('   ✓ FHIR-compliant data structures');
      
      return {
        phase: 'Phase 2: Medical History & Clinical Data',
        success: true,
        patientsPopulated: insertion?.successful || 0,
        medicalDataTables: Object.keys(insertion?.tableStats || {}),
        duration: result.result?.duration
      };
    } else {
      console.error('\n❌ PHASE 2 FAILED');
      console.error('Error:', result.error);
      
      // Provide specific guidance for common issues
      if (result.error?.includes('row-level security') || result.error?.includes('42501')) {
        console.log('\n🔧 RLS TROUBLESHOOTING FOR MEDICAL DATA:');
        console.log('   The medical history tables require special permissions.');
        console.log('   This is expected behavior for healthcare data protection.');
        console.log('   The population script uses enhanced error handling for RLS.');
      }
      
      return {
        phase: 'Phase 2: Medical History & Clinical Data',
        success: false,
        error: result.error
      };
    }
  } catch (error) {
    console.error('\n💥 PHASE 2 EXCEPTION:', error);
    return {
      phase: 'Phase 2: Medical History & Clinical Data',
      success: false,
      error: error.message
    };
  }
}

// Execute Phase 2 immediately when this module is loaded
if (typeof window !== 'undefined') {
  console.log('🏥 Phase 2: Medical History & Clinical Data - Ready for execution');
  console.log('💡 Execute with: executePhase2MedicalData()');
  (window as any).executePhase2MedicalData = executePhase2MedicalData;
  
  // Auto-execute Phase 2
  console.log('🚀 Auto-executing Phase 2...');
  executePhase2MedicalData().then(result => {
    console.log('🎯 Phase 2 Execution Complete:', result);
  }).catch(error => {
    console.error('💥 Phase 2 Execution Error:', error);
  });
}

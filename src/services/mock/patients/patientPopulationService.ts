
import { PatientDataPopulation, PopulationResult } from './patientDataPopulation';
import { supabase } from '@/integrations/supabase/client';

export class PatientPopulationService {
  /**
   * Execute the complete patient population plan
   */
  static async executePopulationPlan(): Promise<PopulationResult> {
    console.log('🚀 Patient Population Service: Starting execution');
    
    try {
      console.log('📞 Calling PatientDataPopulation.executePopulationPlan()...');
      const result = await PatientDataPopulation.executePopulationPlan();
      console.log('✅ PatientDataPopulation.executePopulationPlan() completed');
      
      if (result.success) {
        console.log('✅ Patient population plan completed successfully!');
        console.log(`📊 Summary: ${result.databaseInsertion.successful}/${result.databaseInsertion.totalPatients} patients added to database`);
        
        if (result.fhirSync) {
          console.log(`🔄 FHIR Sync: ${result.fhirSync.successful}/${result.fhirSync.attempted} patients synchronized`);
        }
      } else {
        console.error('❌ Patient population plan failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('💥 Patient Population Service error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  /**
   * Check current database state
   */
  static async checkDatabaseState() {
    console.log('🔍 Checking database state...');
    
    try {
      console.log('📡 Querying patients table...');
      const { data: patients, error } = await supabase
        .from('patients')
        .select('id, name, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error checking database state:', error);
        return { error: error.message };
      }

      console.log(`📊 Current database state: ${patients.length} patients`);
      
      // Show recent patients
      const recentPatients = patients.slice(0, 5);
      console.log('Recent patients:');
      recentPatients.forEach(patient => {
        console.log(`  - ${patient.name} (${patient.id})`);
      });

      return {
        totalPatients: patients.length,
        recentPatients: recentPatients,
        canProceed: true
      };
    } catch (error) {
      console.error('💥 Exception checking database state:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return { error: error.message };
    }
  }

  /**
   * Validate plan prerequisites
   */
  static async validatePrerequisites() {
    console.log('🔍 Validating prerequisites for patient population...');
    
    const checks = [
      { name: 'Database connection', test: () => supabase.from('patients').select('count').limit(1) },
      { name: 'Patients table', test: () => supabase.from('patients').select('id').limit(1) },
      { name: 'Related tables', test: () => supabase.from('gp_details').select('id').limit(1) }
    ];

    const results = [];
    
    for (const check of checks) {
      try {
        console.log(`🧪 Testing: ${check.name}...`);
        await check.test();
        results.push({ name: check.name, status: 'OK' });
        console.log(`✅ ${check.name}: OK`);
      } catch (error) {
        results.push({ name: check.name, status: 'FAILED', error: error.message });
        console.error(`❌ ${check.name}: FAILED - ${error.message}`);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
    }

    const allPassed = results.every(r => r.status === 'OK');
    console.log(`🎯 Prerequisites check: ${allPassed ? 'PASSED' : 'FAILED'}`);
    
    return { allPassed, results };
  }
}


import { PatientDataGenerator } from './patientDataGenerator';
import { PatientDatabaseInserter, InsertionSummary } from './patientDatabaseInserter';
import { FhirPatientService } from '../../fhir/fhirPatientService';
import { Patient } from '@/types/patient';

export interface PopulationResult {
  phase: string;
  patientsGenerated: number;
  databaseInsertion: InsertionSummary;
  fhirSync?: {
    attempted: number;
    successful: number;
    failed: number;
  };
  duration: number;
  success: boolean;
  error?: string;
}

export class PatientDataPopulation {
  /**
   * Execute the complete patient data population plan
   */
  static async executePopulationPlan(): Promise<PopulationResult> {
    const startTime = Date.now();
    
    console.log('🎯 Starting Patient Data Population Plan Implementation');
    console.log('📋 Plan: Add 15 new patients with comprehensive data across all database tables');
    
    try {
      // Phase 1: Generate patient data
      console.log('\n🔄 Phase 1: Patient Data Generation');
      const generatedPatients = PatientDataGenerator.generateAllPatients();
      console.log(`✅ Generated ${generatedPatients.length} patients with complete data profiles`);
      
      // Log sample of generated data
      console.log('\n📊 Sample Generated Patient Data:');
      generatedPatients.slice(0, 2).forEach(patient => {
        console.log(`   Patient: ${patient.name} (${patient.id})`);
        console.log(`   Demographics: ${patient.ethnicity}, ${patient.maritalStatus}`);
        console.log(`   Medical History: ${patient.medicalHistory?.vitalSigns?.length || 0} vitals, ${patient.medicalHistory?.medicationHistory?.length || 0} medications`);
        console.log(`   Accessibility: ${patient.reasonableAdjustments?.hasAdjustments ? 'Has adjustments' : 'No adjustments'}`);
        console.log(`   Social: ${patient.relatedPeople?.length || 0} contacts, ${patient.pharmacies?.length || 0} pharmacies`);
      });

      // Phase 2: Database insertion
      console.log('\n🔄 Phase 2: Database Insertion');
      const insertionResult = await PatientDatabaseInserter.insertAllPatients(generatedPatients);
      
      // Phase 3: FHIR synchronization
      console.log('\n🔄 Phase 3: FHIR Synchronization');
      let fhirSyncResult = { attempted: 0, successful: 0, failed: 0 };
      
      if (insertionResult.successful > 0) {
        const successfulPatients = generatedPatients.filter((_, index) => 
          insertionResult.results[index].success
        );
        
        fhirSyncResult.attempted = successfulPatients.length;
        
        for (const patient of successfulPatients) {
          try {
            const synced = await FhirPatientService.syncPatientToFhir(patient);
            if (synced) {
              fhirSyncResult.successful++;
            } else {
              fhirSyncResult.failed++;
            }
          } catch (error) {
            console.error(`FHIR sync failed for patient ${patient.id}:`, error);
            fhirSyncResult.failed++;
          }
        }
      }

      const duration = Date.now() - startTime;
      const success = insertionResult.successful > 0;

      // Final results
      console.log('\n🎯 Population Plan Results:');
      console.log(`   Duration: ${Math.round(duration / 1000)}s`);
      console.log(`   Patients Generated: ${generatedPatients.length}`);
      console.log(`   Database Insertion: ${insertionResult.successful}/${insertionResult.totalPatients} successful`);
      console.log(`   FHIR Synchronization: ${fhirSyncResult.successful}/${fhirSyncResult.attempted} successful`);
      console.log(`   Overall Success: ${success ? 'YES' : 'NO'}`);

      if (insertionResult.tableStats) {
        console.log('\n📊 Table Population Statistics:');
        Object.entries(insertionResult.tableStats).forEach(([table, stats]) => {
          console.log(`   ${table}: ${stats.successful}/${stats.attempted} records`);
        });
      }

      return {
        phase: 'Complete Patient Data Population',
        patientsGenerated: generatedPatients.length,
        databaseInsertion: insertionResult,
        fhirSync: fhirSyncResult,
        duration,
        success,
        error: success ? undefined : 'Some patients failed to insert'
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ Population plan failed:', error);
      
      return {
        phase: 'Failed',
        patientsGenerated: 0,
        databaseInsertion: {
          totalPatients: 0,
          successful: 0,
          failed: 0,
          results: [],
          tableStats: {}
        },
        duration,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate a single patient for testing
   */
  static generateSamplePatient(index: number = 0): Patient {
    return PatientDataGenerator.generatePatient(index);
  }

  /**
   * Get population statistics
   */
  static async getPopulationStatistics() {
    // This could be expanded to check current database state
    return {
      planStatus: 'Ready to execute',
      targetPatients: 15,
      phases: [
        'Patient Demographics & Core Data',
        'Medical History & Clinical Data', 
        'Reasonable Adjustments & Accessibility',
        'Data Validation & Integration'
      ]
    };
  }
}

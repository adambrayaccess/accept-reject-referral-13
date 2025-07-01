
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';
import { FhirResourceService } from './fhirResourceService';
import { FhirPatientMapper } from './mappers/patientMapper';

export class FhirPatientService {
  /**
   * Generate FHIR Patient resource from database patient
   */
  static async generateFhirPatientResource(patientId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .rpc('generate_fhir_patient_resource', { 
          patient_row: { id: patientId } 
        });

      if (error) {
        console.error('Error generating FHIR Patient resource:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error generating FHIR Patient resource:', error);
      return null;
    }
  }

  /**
   * Create or update FHIR Patient resource
   */
  static async syncPatientToFhir(patient: Patient): Promise<boolean> {
    try {
      console.log('=== FHIR Patient Service ===');
      console.log('Syncing patient to FHIR:', patient.id);

      // Generate comprehensive FHIR resource using new mapper
      const fhirResource = FhirPatientMapper.createFhirPatient(patient);
      
      console.log('Generated FHIR Patient resource:', JSON.stringify(fhirResource, null, 2));
      
      // Check if FHIR resource already exists
      const existingResource = await FhirResourceService.getFhirResource(`Patient/${patient.id}`);
      
      if (existingResource) {
        console.log('Updating existing FHIR Patient resource');
        // Update existing resource
        await FhirResourceService.updateFhirResource(
          `Patient/${patient.id}`,
          fhirResource
        );
      } else {
        console.log('Creating new FHIR Patient resource');
        // Create new resource
        await FhirResourceService.createFhirResource(
          'Patient',
          fhirResource,
          patient.id,
          'patients'
        );
      }

      // Update patient with FHIR ID
      await supabase
        .from('patients')
        .update({ fhir_id: `Patient/${patient.id}` })
        .eq('id', patient.id);

      console.log('✅ Patient successfully synced to FHIR:', patient.id);
      return true;
    } catch (error) {
      console.error('Error syncing patient to FHIR:', error);
      return false;
    }
  }

  /**
   * Get all patients and sync them to FHIR
   */
  static async bulkSyncPatientsToFhir(): Promise<{ successful: string[]; failed: string[] }> {
    const successful: string[] = [];
    const failed: string[] = [];

    try {
      console.log('=== FHIR Patient Bulk Sync ===');
      
      // Fetch all patients from database
      const { data: patients, error } = await supabase
        .from('patients')
        .select('*');

      if (error) {
        console.error('Error fetching patients:', error);
        return { successful, failed };
      }

      console.log(`Starting bulk sync for ${patients.length} patients`);

      for (const patient of patients) {
        try {
          const synced = await this.syncPatientToFhir(patient);
          if (synced) {
            successful.push(patient.id);
          } else {
            failed.push(patient.id);
          }
        } catch (error) {
          console.error(`Failed to sync patient ${patient.id}:`, error);
          failed.push(patient.id);
        }
      }

      console.log(`Patient bulk sync completed: ${successful.length} successful, ${failed.length} failed`);
      return { successful, failed };
    } catch (error) {
      console.error('Error during patient bulk sync:', error);
      return { successful, failed };
    }
  }
}

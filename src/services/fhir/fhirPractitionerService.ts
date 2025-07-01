
import { supabase } from '@/integrations/supabase/client';
import { FhirPractitioner } from '@/types/referral';
import { FhirResourceService } from './fhirResourceService';
import { FhirPractitionerMapper } from './mappers/practitionerMapper';

export class FhirPractitionerService {
  /**
   * Create or update FHIR Practitioner resource
   */
  static async syncPractitionerToFhir(practitioner: FhirPractitioner): Promise<boolean> {
    try {
      console.log('=== FHIR Practitioner Service ===');
      console.log('Syncing practitioner to FHIR:', practitioner.id);

      // Generate comprehensive FHIR resource using new mapper
      const fhirResource = FhirPractitionerMapper.createFhirPractitioner(practitioner);
      
      console.log('Generated FHIR Practitioner resource:', JSON.stringify(fhirResource, null, 2));
      
      // Check if FHIR resource already exists
      const existingResource = await FhirResourceService.getFhirResource(`Practitioner/${practitioner.id}`);
      
      if (existingResource) {
        console.log('Updating existing FHIR Practitioner resource');
        // Update existing resource
        await FhirResourceService.updateFhirResource(
          `Practitioner/${practitioner.id}`,
          fhirResource
        );
      } else {
        console.log('Creating new FHIR Practitioner resource');
        // Create new resource
        await FhirResourceService.createFhirResource(
          'Practitioner',
          fhirResource,
          practitioner.id,
          'practitioners'
        );
      }

      // Update practitioner with FHIR ID
      await supabase
        .from('practitioners')
        .update({ fhir_id: `Practitioner/${practitioner.id}` })
        .eq('id', practitioner.id);

      console.log('✅ Practitioner successfully synced to FHIR:', practitioner.id);
      return true;
    } catch (error) {
      console.error('Error syncing practitioner to FHIR:', error);
      return false;
    }
  }

  /**
   * Get all practitioners and sync them to FHIR
   */
  static async bulkSyncPractitionersToFhir(): Promise<{ successful: string[]; failed: string[] }> {
    const successful: string[] = [];
    const failed: string[] = [];

    try {
      console.log('=== FHIR Practitioner Bulk Sync ===');
      
      // Fetch all practitioners from database
      const { data: practitioners, error } = await supabase
        .from('practitioners')
        .select('*');

      if (error) {
        console.error('Error fetching practitioners:', error);
        return { successful, failed };
      }

      console.log(`Starting bulk sync for ${practitioners.length} practitioners`);

      for (const practitioner of practitioners) {
        try {
          const synced = await this.syncPractitionerToFhir(practitioner);
          if (synced) {
            successful.push(practitioner.id);
          } else {
            failed.push(practitioner.id);
          }
        } catch (error) {
          console.error(`Failed to sync practitioner ${practitioner.id}:`, error);
          failed.push(practitioner.id);
        }
      }

      console.log(`Practitioner bulk sync completed: ${successful.length} successful, ${failed.length} failed`);
      return { successful, failed };
    } catch (error) {
      console.error('Error during practitioner bulk sync:', error);
      return { successful, failed };
    }
  }
}

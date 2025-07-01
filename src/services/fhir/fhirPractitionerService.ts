
import { supabase } from '@/integrations/supabase/client';
import { FhirPractitioner } from '@/types/referral';
import { FhirResourceService } from './fhirResourceService';

export class FhirPractitionerService {
  /**
   * Create or update FHIR Practitioner resource
   */
  static async syncPractitionerToFhir(practitioner: FhirPractitioner): Promise<boolean> {
    try {
      // Generate FHIR Practitioner resource
      const fhirResource = this.createFhirPractitionerFromPractitioner(practitioner);
      
      // Check if FHIR resource already exists
      const existingResource = await FhirResourceService.getFhirResource(`Practitioner/${practitioner.id}`);
      
      if (existingResource) {
        // Update existing resource
        await FhirResourceService.updateFhirResource(
          `Practitioner/${practitioner.id}`,
          fhirResource
        );
      } else {
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

      return true;
    } catch (error) {
      console.error('Error syncing practitioner to FHIR:', error);
      return false;
    }
  }

  /**
   * Create FHIR Practitioner resource from Practitioner object
   */
  private static createFhirPractitionerFromPractitioner(practitioner: FhirPractitioner): any {
    const fhirPractitioner: any = {
      resourceType: 'Practitioner',
      id: practitioner.id,
      meta: {
        versionId: '1',
        lastUpdated: new Date().toISOString()
      },
      active: true,
      name: [
        {
          use: 'official',
          text: practitioner.name
        }
      ]
    };

    // Add qualification if available
    if (practitioner.role) {
      fhirPractitioner.qualification = [
        {
          code: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0360',
                display: practitioner.role
              }
            ],
            text: practitioner.role
          }
        }
      ];
    }

    // Add contact information if available
    if (practitioner.contact) {
      fhirPractitioner.telecom = [
        {
          system: 'phone',
          value: practitioner.contact,
          use: 'work'
        }
      ];
    }

    return fhirPractitioner;
  }
}

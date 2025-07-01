
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';
import { FhirResourceService } from './fhirResourceService';

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
      // Generate FHIR resource
      const fhirResource = await this.createFhirPatientFromPatient(patient);
      
      // Check if FHIR resource already exists
      const existingResource = await FhirResourceService.getFhirResource(`Patient/${patient.id}`);
      
      if (existingResource) {
        // Update existing resource
        await FhirResourceService.updateFhirResource(
          `Patient/${patient.id}`,
          fhirResource
        );
      } else {
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

      return true;
    } catch (error) {
      console.error('Error syncing patient to FHIR:', error);
      return false;
    }
  }

  /**
   * Create FHIR Patient resource from Patient object
   */
  private static createFhirPatientFromPatient(patient: Patient): any {
    const fhirPatient = {
      resourceType: 'Patient',
      id: patient.id,
      meta: {
        versionId: '1',
        lastUpdated: new Date().toISOString()
      },
      active: true,
      identifier: [
        {
          use: 'official',
          system: 'https://fhir.nhs.uk/Id/nhs-number',
          value: patient.nhsNumber
        }
      ],
      name: [
        {
          use: 'official',
          text: patient.name
        }
      ],
      gender: this.mapGender(patient.gender),
      birthDate: patient.birthDate
    };

    // Add address if available
    if (patient.address) {
      fhirPatient.address = [
        {
          use: 'home',
          text: patient.address
        }
      ];
    }

    // Add phone if available
    if (patient.phone) {
      fhirPatient.telecom = [
        {
          system: 'phone',
          value: patient.phone,
          use: 'home'
        }
      ];
    }

    // Add marital status if available
    if (patient.maritalStatus) {
      fhirPatient.maritalStatus = {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-MaritalStatus',
            code: patient.maritalStatus.toLowerCase(),
            display: patient.maritalStatus
          }
        ]
      };
    }

    return fhirPatient;
  }

  /**
   * Map patient gender to FHIR gender
   */
  private static mapGender(gender?: string): string {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'male';
      case 'female':
        return 'female';
      case 'other':
        return 'other';
      default:
        return 'unknown';
    }
  }
}

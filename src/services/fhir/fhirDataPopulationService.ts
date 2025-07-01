
import { FhirPatientService } from './fhirPatientService';
import { FhirPractitionerService } from './fhirPractitionerService';
import { FhirServiceRequestService } from './fhirServiceRequestService';
import { supabase } from '@/integrations/supabase/client';

export interface PopulationStats {
  patients: { successful: string[]; failed: string[] };
  practitioners: { successful: string[]; failed: string[] };
  referrals: { successful: string[]; failed: string[] };
  totalProcessed: number;
  totalSuccessful: number;
  totalFailed: number;
}

export class FhirDataPopulationService {
  /**
   * Populate all existing data with FHIR-compliant structures
   */
  static async populateAllData(): Promise<PopulationStats> {
    console.log('=== FHIR Data Population Service ===');
    console.log('Starting comprehensive FHIR data population...');

    const stats: PopulationStats = {
      patients: { successful: [], failed: [] },
      practitioners: { successful: [], failed: [] },
      referrals: { successful: [], failed: [] },
      totalProcessed: 0,
      totalSuccessful: 0,
      totalFailed: 0
    };

    try {
      // Step 1: Populate Patients
      console.log('Step 1: Populating Patients...');
      stats.patients = await FhirPatientService.bulkSyncPatientsToFhir();
      
      // Step 2: Populate Practitioners
      console.log('Step 2: Populating Practitioners...');
      stats.practitioners = await FhirPractitionerService.bulkSyncPractitionersToFhir();
      
      // Step 3: Populate Referrals (ServiceRequests)
      console.log('Step 3: Populating Referrals...');
      stats.referrals = await FhirServiceRequestService.bulkSyncReferralsToFhir();

      // Calculate totals
      stats.totalProcessed = 
        stats.patients.successful.length + stats.patients.failed.length +
        stats.practitioners.successful.length + stats.practitioners.failed.length +
        stats.referrals.successful.length + stats.referrals.failed.length;

      stats.totalSuccessful = 
        stats.patients.successful.length +
        stats.practitioners.successful.length +
        stats.referrals.successful.length;

      stats.totalFailed = 
        stats.patients.failed.length +
        stats.practitioners.failed.length +
        stats.referrals.failed.length;

      console.log('=== FHIR Data Population Complete ===');
      console.log(`Total Processed: ${stats.totalProcessed}`);
      console.log(`Total Successful: ${stats.totalSuccessful}`);
      console.log(`Total Failed: ${stats.totalFailed}`);
      console.log('Breakdown:');
      console.log(`- Patients: ${stats.patients.successful.length}/${stats.patients.successful.length + stats.patients.failed.length}`);
      console.log(`- Practitioners: ${stats.practitioners.successful.length}/${stats.practitioners.successful.length + stats.practitioners.failed.length}`);
      console.log(`- Referrals: ${stats.referrals.successful.length}/${stats.referrals.successful.length + stats.referrals.failed.length}`);

      return stats;
    } catch (error) {
      console.error('Error during FHIR data population:', error);
      throw error;
    }
  }

  /**
   * Get current FHIR population statistics
   */
  static async getPopulationStatistics(): Promise<{
    totalFhirResources: number;
    resourceCounts: { [resourceType: string]: number };
    populationPercentage: number;
  }> {
    try {
      // Get FHIR resource counts
      const { data: fhirResources, error: fhirError } = await supabase
        .from('fhir_resources')
        .select('resource_type');

      if (fhirError) {
        console.error('Error fetching FHIR resources:', fhirError);
        return { totalFhirResources: 0, resourceCounts: {}, populationPercentage: 0 };
      }

      // Count resources by type
      const resourceCounts: { [resourceType: string]: number } = {};
      fhirResources.forEach(resource => {
        resourceCounts[resource.resource_type] = (resourceCounts[resource.resource_type] || 0) + 1;
      });

      // Get total legacy records
      const [
        { count: patientCount },
        { count: practitionerCount },
        { count: referralCount }
      ] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('practitioners').select('*', { count: 'exact', head: true }),
        supabase.from('referrals').select('*', { count: 'exact', head: true })
      ]);

      const totalLegacyRecords = (patientCount || 0) + (practitionerCount || 0) + (referralCount || 0);
      const totalFhirResources = fhirResources.length;
      const populationPercentage = totalLegacyRecords > 0 ? 
        Math.round((totalFhirResources / totalLegacyRecords) * 100) : 0;

      return {
        totalFhirResources,
        resourceCounts,
        populationPercentage
      };
    } catch (error) {
      console.error('Error getting population statistics:', error);
      return { totalFhirResources: 0, resourceCounts: {}, populationPercentage: 0 };
    }
  }

  /**
   * Validate FHIR resource integrity
   */
  static async validateFhirIntegrity(): Promise<{
    validResources: number;
    invalidResources: number;
    validationErrors: string[];
  }> {
    console.log('=== FHIR Integrity Validation ===');
    
    let validResources = 0;
    let invalidResources = 0;
    const validationErrors: string[] = [];

    try {
      const { data: fhirResources, error } = await supabase
        .from('fhir_resources')
        .select('*');

      if (error) {
        console.error('Error fetching FHIR resources for validation:', error);
        return { validResources: 0, invalidResources: 0, validationErrors: [error.message] };
      }

      for (const resource of fhirResources) {
        try {
          const resourceData = resource.resource_data;
          
          // Basic FHIR validation
          if (!resourceData.resourceType) {
            validationErrors.push(`Resource ${resource.fhir_id}: Missing resourceType`);
            invalidResources++;
            continue;
          }

          if (!resourceData.id) {
            validationErrors.push(`Resource ${resource.fhir_id}: Missing id`);
            invalidResources++;
            continue;
          }

          // Resource-specific validation
          const isValid = this.validateResourceType(resourceData, resource.resource_type);
          if (isValid) {
            validResources++;
          } else {
            validationErrors.push(`Resource ${resource.fhir_id}: Failed ${resource.resource_type} validation`);
            invalidResources++;
          }
        } catch (validationError) {
          validationErrors.push(`Resource ${resource.fhir_id}: Validation exception - ${validationError}`);
          invalidResources++;
        }
      }

      console.log(`Validation complete: ${validResources} valid, ${invalidResources} invalid`);
      return { validResources, invalidResources, validationErrors };
    } catch (error) {
      console.error('Error during FHIR integrity validation:', error);
      return { validResources: 0, invalidResources: 0, validationErrors: [error.message] };
    }
  }

  private static validateResourceType(resourceData: any, resourceType: string): boolean {
    switch (resourceType) {
      case 'Patient':
        return this.validatePatientResource(resourceData);
      case 'Practitioner':
        return this.validatePractitionerResource(resourceData);
      case 'ServiceRequest':
        return this.validateServiceRequestResource(resourceData);
      default:
        return true; // Unknown resource type, assume valid
    }
  }

  private static validatePatientResource(patient: any): boolean {
    // Check required fields for UK Core Patient
    return !!(
      patient.resourceType === 'Patient' &&
      patient.id &&
      patient.identifier?.length > 0 &&
      patient.name?.length > 0 &&
      patient.birthDate
    );
  }

  private static validatePractitionerResource(practitioner: any): boolean {
    // Check required fields for UK Core Practitioner
    return !!(
      practitioner.resourceType === 'Practitioner' &&
      practitioner.id &&
      practitioner.name?.length > 0 &&
      practitioner.active !== undefined
    );
  }

  private static validateServiceRequestResource(serviceRequest: any): boolean {
    // Check required fields for UK Core ServiceRequest
    return !!(
      serviceRequest.resourceType === 'ServiceRequest' &&
      serviceRequest.id &&
      serviceRequest.status &&
      serviceRequest.intent &&
      serviceRequest.subject?.reference &&
      serviceRequest.code
    );
  }
}

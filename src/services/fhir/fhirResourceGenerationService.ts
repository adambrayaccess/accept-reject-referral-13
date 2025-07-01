
import { FhirSyncService } from './fhirSyncService';
import { FhirResourceService } from './fhirResourceService';
import { DataValidationService } from '../validation/dataValidationService';
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { mapReferralData } from '../referral/referralMappers';

export interface FhirGenerationResult {
  successful: string[];
  failed: string[];
  totalProcessed: number;
  validationErrors: { [key: string]: string[] };
}

export class FhirResourceGenerationService {
  /**
   * Phase 4: Complete FHIR Resource Generation
   * This service orchestrates the generation of all FHIR resources from existing data
   */
  static async generateAllFhirResources(): Promise<FhirGenerationResult> {
    console.log('=== Phase 4: FHIR Resource Generation Started ===');
    
    const result: FhirGenerationResult = {
      successful: [],
      failed: [],
      totalProcessed: 0,
      validationErrors: {}
    };

    try {
      // Step 1: Fetch all referrals with related data
      console.log('Step 1: Fetching all referrals with related data...');
      const referrals = await this.fetchAllReferralsWithRelatedData();
      
      if (!referrals || referrals.length === 0) {
        console.log('No referrals found to process');
        return result;
      }

      console.log(`Found ${referrals.length} referrals to process`);
      result.totalProcessed = referrals.length;

      // Step 2: Process each referral
      for (const referralData of referrals) {
        try {
          await this.processReferralForFhirGeneration(referralData, result);
        } catch (error) {
          console.error(`Error processing referral ${referralData.id}:`, error);
          result.failed.push(referralData.id);
        }
      }

      // Step 3: Generate summary report
      this.generateSummaryReport(result);

      console.log('=== Phase 4: FHIR Resource Generation Completed ===');
      return result;

    } catch (error) {
      console.error('Error in FHIR Resource Generation:', error);
      throw error;
    }
  }

  /**
   * Fetch all referrals with complete related data
   */
  private static async fetchAllReferralsWithRelatedData(): Promise<any[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patients!inner(*,
          gp_details(*),
          related_people(*),
          pharmacy_details(*),
          reasonable_adjustments(*,
            adjustment_details(*)
          ),
          historic_addresses(*),
          allergies(*),
          medications(*),
          vital_signs(*),
          test_results(*),
          mha_sections(*)
        ),
        referrer:practitioners!inner(*)
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching referrals:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Process individual referral for FHIR generation
   */
  private static async processReferralForFhirGeneration(
    referralData: any, 
    result: FhirGenerationResult
  ): Promise<void> {
    const referralId = referralData.id;
    console.log(`Processing referral: ${referralId}`);

    try {
      // Step 1: Map database data to Referral type
      const referral = mapReferralData(referralData);

      // Step 2: Validate data before FHIR generation
      const validation = DataValidationService.validateReferralData(referral);
      if (!validation.isValid) {
        console.warn(`Validation failed for referral ${referralId}:`, validation.errors);
        result.validationErrors[referralId] = validation.errors;
        // Continue processing even with validation warnings
      }

      // Step 3: Generate FHIR resources
      const fhirGenerated = await FhirSyncService.syncReferralToFhir(referral);
      
      if (fhirGenerated) {
        result.successful.push(referralId);
        console.log(`✅ Successfully generated FHIR resources for referral: ${referralId}`);
      } else {
        result.failed.push(referralId);
        console.log(`❌ Failed to generate FHIR resources for referral: ${referralId}`);
      }

    } catch (error) {
      console.error(`Error processing referral ${referralId}:`, error);
      result.failed.push(referralId);
    }
  }

  /**
   * Generate and log summary report
   */
  private static generateSummaryReport(result: FhirGenerationResult): void {
    console.log('\n=== FHIR Resource Generation Summary ===');
    console.log(`Total referrals processed: ${result.totalProcessed}`);
    console.log(`Successfully generated: ${result.successful.length}`);
    console.log(`Failed to generate: ${result.failed.length}`);
    console.log(`Validation warnings: ${Object.keys(result.validationErrors).length}`);
    
    if (result.failed.length > 0) {
      console.log('\nFailed referral IDs:', result.failed);
    }
    
    if (Object.keys(result.validationErrors).length > 0) {
      console.log('\nValidation warnings:');
      Object.entries(result.validationErrors).forEach(([id, errors]) => {
        console.log(`  ${id}: ${errors.join(', ')}`);
      });
    }

    console.log('\n=== FHIR Resources Generated ===');
    console.log('Check the fhir_resources table for all generated FHIR resources');
    console.log('Resources can be queried by resource_type: Patient, Practitioner, ServiceRequest');
  }

  /**
   * Get FHIR generation statistics
   */
  static async getFhirGenerationStatistics(): Promise<{
    totalFhirResources: number;
    patientResources: number;
    practitionerResources: number;
    serviceRequestResources: number;
    lastGenerated: string | null;
  }> {
    try {
      // Get total count of FHIR resources
      const { count: totalCount } = await supabase
        .from('fhir_resources')
        .select('*', { count: 'exact', head: true });

      // Get count by resource type
      const { count: patientCount } = await supabase
        .from('fhir_resources')
        .select('*', { count: 'exact', head: true })
        .eq('resource_type', 'Patient');

      const { count: practitionerCount } = await supabase
        .from('fhir_resources')
        .select('*', { count: 'exact', head: true })
        .eq('resource_type', 'Practitioner');

      const { count: serviceRequestCount } = await supabase
        .from('fhir_resources')
        .select('*', { count: 'exact', head: true })
        .eq('resource_type', 'ServiceRequest');

      // Get last generated timestamp
      const { data: lastResource } = await supabase
        .from('fhir_resources')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        totalFhirResources: totalCount || 0,
        patientResources: patientCount || 0,
        practitionerResources: practitionerCount || 0,
        serviceRequestResources: serviceRequestCount || 0,
        lastGenerated: lastResource?.created_at || null
      };
    } catch (error) {
      console.error('Error getting FHIR generation statistics:', error);
      return {
        totalFhirResources: 0,
        patientResources: 0,
        practitionerResources: 0,
        serviceRequestResources: 0,
        lastGenerated: null
      };
    }
  }

  /**
   * Regenerate FHIR resources for specific referrals
   */
  static async regenerateFhirResourcesForReferrals(referralIds: string[]): Promise<FhirGenerationResult> {
    console.log(`=== Regenerating FHIR Resources for ${referralIds.length} referrals ===`);
    
    const result: FhirGenerationResult = {
      successful: [],
      failed: [],
      totalProcessed: referralIds.length,
      validationErrors: {}
    };

    try {
      // Fetch specific referrals
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select(`
          *,
          patient:patients!inner(*,
            gp_details(*),
            related_people(*),
            pharmacy_details(*),
            reasonable_adjustments(*,
              adjustment_details(*)
            ),
            historic_addresses(*),
            allergies(*),
            medications(*),
            vital_signs(*),
            test_results(*),
            mha_sections(*)
          ),
          referrer:practitioners!inner(*)
        `)
        .in('id', referralIds);

      if (error) {
        console.error('Error fetching referrals for regeneration:', error);
        throw error;
      }

      if (!referrals || referrals.length === 0) {
        console.log('No referrals found for regeneration');
        return result;
      }

      // Process each referral
      for (const referralData of referrals) {
        await this.processReferralForFhirGeneration(referralData, result);
      }

      this.generateSummaryReport(result);
      return result;

    } catch (error) {
      console.error('Error in FHIR resource regeneration:', error);
      throw error;
    }
  }
}

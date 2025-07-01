
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { FhirResourceService } from './fhirResourceService';
import { FhirServiceRequestMapper } from './mappers/serviceRequestMapper';

export class FhirServiceRequestService {
  /**
   * Create or update FHIR ServiceRequest resource from referral
   */
  static async syncReferralToFhir(referral: Referral): Promise<boolean> {
    try {
      console.log('=== FHIR ServiceRequest Service ===');
      console.log('Syncing referral to FHIR:', referral.id);

      // Generate comprehensive FHIR ServiceRequest resource using new mapper
      const fhirResource = FhirServiceRequestMapper.createFhirServiceRequest(referral);
      
      console.log('Generated FHIR ServiceRequest resource:', JSON.stringify(fhirResource, null, 2));
      
      // Check if FHIR resource already exists
      const existingResource = await FhirResourceService.getFhirResource(`ServiceRequest/${referral.id}`);
      
      if (existingResource) {
        console.log('Updating existing FHIR ServiceRequest resource');
        // Update existing resource
        await FhirResourceService.updateFhirResource(
          `ServiceRequest/${referral.id}`,
          fhirResource
        );
      } else {
        console.log('Creating new FHIR ServiceRequest resource');
        // Create new resource
        await FhirResourceService.createFhirResource(
          'ServiceRequest',
          fhirResource,
          referral.id,
          'referrals'
        );
      }

      // Update referral with FHIR ID
      await supabase
        .from('referrals')
        .update({ fhir_id: `ServiceRequest/${referral.id}` })
        .eq('id', referral.id);

      console.log('✅ Referral successfully synced to FHIR:', referral.id);
      return true;
    } catch (error) {
      console.error('Error syncing referral to FHIR:', error);
      return false;
    }
  }

  /**
   * Get all referrals and sync them to FHIR
   */
  static async bulkSyncReferralsToFhir(): Promise<{ successful: string[]; failed: string[] }> {
    const successful: string[] = [];
    const failed: string[] = [];

    try {
      console.log('=== FHIR ServiceRequest Bulk Sync ===');
      
      // Fetch all referrals with related data
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select(`
          *,
          patient:patients(*),
          referrer:practitioners(*)
        `);

      if (error) {
        console.error('Error fetching referrals:', error);
        return { successful, failed };
      }

      console.log(`Starting bulk sync for ${referrals.length} referrals`);

      for (const referralData of referrals) {
        try {
          // Map the database result to Referral type
          const referral = this.mapDatabaseToReferral(referralData);
          const synced = await this.syncReferralToFhir(referral);
          
          if (synced) {
            successful.push(referral.id);
          } else {
            failed.push(referral.id);
          }
        } catch (error) {
          console.error(`Failed to sync referral ${referralData.id}:`, error);
          failed.push(referralData.id);
        }
      }

      console.log(`Referral bulk sync completed: ${successful.length} successful, ${failed.length} failed`);
      return { successful, failed };
    } catch (error) {
      console.error('Error during referral bulk sync:', error);
      return { successful, failed };
    }
  }

  private static mapDatabaseToReferral(data: any): Referral {
    return {
      id: data.id,
      ubrn: data.ubrn,
      created: data.created_at,
      status: data.status,
      priority: data.priority,
      patient: {
        id: data.patient.id,
        name: data.patient.name,
        birthDate: data.patient.birth_date,
        gender: data.patient.gender,
        nhsNumber: data.patient.nhs_number,
        address: data.patient.address,
        phone: data.patient.phone,
        fhirId: data.patient.fhir_id,
        active: data.patient.active,
        maritalStatus: data.patient.marital_status_display,
        ethnicity: data.patient.ethnicity,
        pronouns: data.patient.pronouns,
        accommodationType: data.patient.accommodation_type
      },
      referrer: {
        id: data.referrer.id,
        name: data.referrer.name,
        role: data.referrer.role,
        organization: data.referrer.organization,
        contact: data.referrer.contact,
        fhirId: data.referrer.fhir_id,
        active: data.referrer.active,
        gender: data.referrer.gender,
        birthDate: data.referrer.birth_date
      },
      specialty: data.specialty,
      service: data.service,
      clinicalInfo: {
        reason: data.reason,
        history: data.history,
        diagnosis: data.diagnosis,
        medications: data.medications ? data.medications.split(',') : [],
        allergies: data.allergies_info ? data.allergies_info.split(',') : [],
        notes: data.notes
      },
      attachments: [],
      triageStatus: data.triage_status,
      parentReferralId: data.parent_referral_id,
      isSubReferral: data.is_sub_referral,
      aiGenerated: data.ai_generated,
      confidence: data.confidence,
      teamId: data.team_id,
      assignedHCPId: data.assigned_hcp_id,
      allocatedDate: data.allocated_date,
      allocatedBy: data.allocated_by,
      fhirId: data.fhir_id,
      intent: data.intent,
      authoredOn: data.authored_on,
      supportingInfo: data.supporting_info
    };
  }
}

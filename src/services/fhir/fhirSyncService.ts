
import { FhirPatientService } from './fhirPatientService';
import { FhirServiceRequestService } from './fhirServiceRequestService';
import { FhirPractitionerService } from './fhirPractitionerService';
import { Referral } from '@/types/referral';
import { Patient } from '@/types/patient';
import { FhirPractitioner } from '@/types/referral';

export class FhirSyncService {
  /**
   * Sync a complete referral (including patient and practitioner) to FHIR
   */
  static async syncReferralToFhir(referral: Referral): Promise<boolean> {
    console.log('=== FHIR Sync Service ===');
    console.log('Starting FHIR sync for referral:', referral.id);

    try {
      // Sync patient to FHIR
      console.log('Syncing patient to FHIR:', referral.patient.id);
      const patientSynced = await FhirPatientService.syncPatientToFhir(referral.patient);
      if (!patientSynced) {
        console.error('Failed to sync patient to FHIR');
        return false;
      }

      // Sync practitioner to FHIR
      console.log('Syncing practitioner to FHIR:', referral.referrer.id);
      const practitionerSynced = await FhirPractitionerService.syncPractitionerToFhir(referral.referrer);
      if (!practitionerSynced) {
        console.error('Failed to sync practitioner to FHIR');
        return false;
      }

      // Sync referral (ServiceRequest) to FHIR
      console.log('Syncing referral to FHIR:', referral.id);
      const referralSynced = await FhirServiceRequestService.syncReferralToFhir(referral);
      if (!referralSynced) {
        console.error('Failed to sync referral to FHIR');
        return false;
      }

      console.log('✅ FHIR sync completed successfully for referral:', referral.id);
      return true;
    } catch (error) {
      console.error('Error during FHIR sync:', error);
      return false;
    }
  }

  /**
   * Bulk sync multiple referrals to FHIR
   */
  static async bulkSyncReferralsToFhir(referrals: Referral[]): Promise<{
    successful: string[];
    failed: string[];
  }> {
    const successful: string[] = [];
    const failed: string[] = [];

    console.log(`Starting bulk FHIR sync for ${referrals.length} referrals`);

    for (const referral of referrals) {
      try {
        const synced = await this.syncReferralToFhir(referral);
        if (synced) {
          successful.push(referral.id);
        } else {
          failed.push(referral.id);
        }
      } catch (error) {
        console.error(`Failed to sync referral ${referral.id}:`, error);
        failed.push(referral.id);
      }
    }

    console.log(`Bulk FHIR sync completed: ${successful.length} successful, ${failed.length} failed`);
    return { successful, failed };
  }

  /**
   * Sync individual patient to FHIR
   */
  static async syncPatientToFhir(patient: Patient): Promise<boolean> {
    return await FhirPatientService.syncPatientToFhir(patient);
  }

  /**
   * Sync individual practitioner to FHIR
   */
  static async syncPractitionerToFhir(practitioner: FhirPractitioner): Promise<boolean> {
    return await FhirPractitionerService.syncPractitionerToFhir(practitioner);
  }
}


import { FhirSyncService } from '@/services/fhir';
import { Referral } from '@/types/referral';

export class FhirIntegrationService {
  /**
   * Automatically sync referral to FHIR when it's created or updated
   */
  static async handleReferralChange(referral: Referral): Promise<void> {
    try {
      console.log('=== FHIR Integration Service ===');
      console.log('Handling referral change for FHIR sync:', referral.id);
      
      const synced = await FhirSyncService.syncReferralToFhir(referral);
      
      if (synced) {
        console.log('✅ Referral successfully synced to FHIR:', referral.id);
      } else {
        console.error('❌ Failed to sync referral to FHIR:', referral.id);
      }
    } catch (error) {
      console.error('Error in FHIR integration service:', error);
    }
  }

  /**
   * Sync all existing referrals to FHIR (for initial setup)
   */
  static async syncAllReferralsToFhir(referrals: Referral[]): Promise<void> {
    console.log('=== FHIR Integration Service - Bulk Sync ===');
    console.log(`Starting bulk sync of ${referrals.length} referrals to FHIR`);
    
    const result = await FhirSyncService.bulkSyncReferralsToFhir(referrals);
    
    console.log('Bulk sync results:', result);
    console.log(`✅ Successfully synced: ${result.successful.length} referrals`);
    console.log(`❌ Failed to sync: ${result.failed.length} referrals`);
    
    if (result.failed.length > 0) {
      console.log('Failed referral IDs:', result.failed);
    }
  }
}

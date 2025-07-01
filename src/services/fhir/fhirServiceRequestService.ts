
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { FhirResourceService } from './fhirResourceService';

export class FhirServiceRequestService {
  /**
   * Create or update FHIR ServiceRequest resource from referral
   */
  static async syncReferralToFhir(referral: Referral): Promise<boolean> {
    try {
      // Generate FHIR ServiceRequest resource
      const fhirResource = this.createFhirServiceRequestFromReferral(referral);
      
      // Check if FHIR resource already exists
      const existingResource = await FhirResourceService.getFhirResource(`ServiceRequest/${referral.id}`);
      
      if (existingResource) {
        // Update existing resource
        await FhirResourceService.updateFhirResource(
          `ServiceRequest/${referral.id}`,
          fhirResource
        );
      } else {
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

      return true;
    } catch (error) {
      console.error('Error syncing referral to FHIR:', error);
      return false;
    }
  }

  /**
   * Create FHIR ServiceRequest resource from Referral object
   */
  private static createFhirServiceRequestFromReferral(referral: Referral): any {
    const fhirServiceRequest: any = {
      resourceType: 'ServiceRequest',
      id: referral.id,
      meta: {
        versionId: '1',
        lastUpdated: new Date().toISOString()
      },
      status: this.mapReferralStatus(referral.status),
      intent: 'order',
      priority: this.mapReferralPriority(referral.priority),
      category: [
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '103693007',
              display: 'Diagnostic procedure'
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            display: referral.specialty
          }
        ],
        text: referral.specialty
      },
      subject: {
        reference: `Patient/${referral.patient.id}`,
        display: referral.patient.name
      },
      authoredOn: referral.created,
      requester: {
        reference: `Practitioner/${referral.referrer.id}`,
        display: referral.referrer.name
      },
      reasonReference: [
        {
          text: referral.clinicalInfo.reason
        }
      ]
    };

    // Add clinical information
    if (referral.clinicalInfo.history) {
      fhirServiceRequest.note = [
        {
          text: referral.clinicalInfo.history
        }
      ];
    }

    // Add supporting information
    if (referral.clinicalInfo.diagnosis) {
      fhirServiceRequest.supportingInfo = [
        {
          text: referral.clinicalInfo.diagnosis
        }
      ];
    }

    return fhirServiceRequest;
  }

  /**
   * Map referral status to FHIR ServiceRequest status
   */
  private static mapReferralStatus(status: string): string {
    switch (status) {
      case 'new':
        return 'active';
      case 'accepted':
        return 'active';
      case 'rejected':
        return 'revoked';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'revoked';
      default:
        return 'active';
    }
  }

  /**
   * Map referral priority to FHIR ServiceRequest priority
   */
  private static mapReferralPriority(priority: string): string {
    switch (priority) {
      case 'routine':
        return 'routine';
      case 'urgent':
        return 'urgent';
      case 'emergency':
        return 'stat';
      default:
        return 'routine';
    }
  }
}

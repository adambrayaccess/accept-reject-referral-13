
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { mapReferralData } from './referralMappers';

export const fetchReferralById = async (referralId: string): Promise<Referral | null> => {
  try {
    console.log(`Fetching referral by ID: ${referralId}`);
    
    const { data: referral, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patients!inner(
          *,
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
        referrer:practitioners!inner(*),
        referral_tags(tag),
        audit_log(*),
        collaboration_notes(*),
        appointments(*),
        attachments(*),
        rtt_pathways(*),
        care_pathways(*)
      `)
      .eq('id', referralId)
      .single();

    if (error) {
      console.error('Error fetching referral:', error);
      return null;
    }

    if (!referral) {
      console.log('Referral not found');
      return null;
    }

    // Fetch child referral IDs if this referral has children
    let childReferralIds: string[] = [];
    if (!referral.is_sub_referral) {
      const { data: childReferrals, error: childError } = await supabase
        .from('referrals')
        .select('id, specialty, triage_status')
        .eq('parent_referral_id', referralId);
      
      if (!childError && childReferrals) {
        childReferralIds = childReferrals.map(child => child.id);
      }
    }

    console.log('Successfully fetched referral:', referral.id);
    const mappedReferral = mapReferralData(referral);
    
    // Override the childReferralIds with the actual data
    mappedReferral.childReferralIds = childReferralIds;
    
    return mappedReferral;
  } catch (error) {
    console.error('Error fetching referral:', error);
    return null;
  }
};

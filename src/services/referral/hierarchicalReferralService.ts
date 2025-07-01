
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { mapReferralData } from './referralMappers';

export const fetchChildReferrals = async (parentReferralId: string): Promise<Referral[]> => {
  try {
    console.log(`Fetching child referrals for parent: ${parentReferralId}`);
    
    const { data: referrals, error } = await supabase
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
        attachments(*)
      `)
      .eq('parent_referral_id', parentReferralId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching child referrals:', error);
      return [];
    }

    console.log(`Successfully fetched ${referrals?.length || 0} child referrals`);
    return referrals ? referrals.map(mapReferralData) : [];
  } catch (error) {
    console.error('Error fetching child referrals:', error);
    return [];
  }
};

export const fetchParentReferral = async (childReferralId: string): Promise<Referral | null> => {
  try {
    console.log(`Fetching parent referral for child: ${childReferralId}`);
    
    // First get the child referral to find the parent ID
    const { data: childReferral, error: childError } = await supabase
      .from('referrals')
      .select('parent_referral_id')
      .eq('id', childReferralId)
      .single();

    if (childError || !childReferral?.parent_referral_id) {
      console.log('Child referral has no parent or error occurred:', childError);
      return null;
    }

    // Now fetch the parent referral
    const { data: parentReferral, error: parentError } = await supabase
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
        attachments(*)
      `)
      .eq('id', childReferral.parent_referral_id)
      .single();

    if (parentError) {
      console.error('Error fetching parent referral:', parentError);
      return null;
    }

    console.log('Successfully fetched parent referral');
    return parentReferral ? mapReferralData(parentReferral) : null;
  } catch (error) {
    console.error('Error fetching parent referral:', error);
    return null;
  }
};

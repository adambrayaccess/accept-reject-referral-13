
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { mapReferralData } from './referralMappers';
import { fetchReferralById } from './singleReferralService';

export const fetchChildReferrals = async (parentReferralId: string): Promise<Referral[]> => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patient_id (
          *
        ),
        referrer:referrer_id (
          *
        )
      `)
      .eq('parent_referral_id', parentReferralId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching child referrals:', error);
      return [];
    }

    return referrals.map(mapReferralData);
  } catch (error) {
    console.error('Error fetching child referrals:', error);
    return [];
  }
};

export const fetchParentReferral = async (childReferralId: string): Promise<Referral | null> => {
  try {
    // First get the child referral to find its parent
    const { data: childReferral, error: childError } = await supabase
      .from('referrals')
      .select('parent_referral_id')
      .eq('id', childReferralId)
      .single();

    if (childError || !childReferral?.parent_referral_id) {
      return null;
    }

    return await fetchReferralById(childReferral.parent_referral_id);
  } catch (error) {
    console.error('Error fetching parent referral:', error);
    return null;
  }
};

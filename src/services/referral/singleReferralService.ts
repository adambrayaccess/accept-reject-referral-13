
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { mapReferralData } from './referralMappers';

export const fetchReferralById = async (referralId: string): Promise<Referral | null> => {
  try {
    const { data: referral, error } = await supabase
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

    return mapReferralData(referral);
  } catch (error) {
    console.error('Error fetching referral:', error);
    return null;
  }
};

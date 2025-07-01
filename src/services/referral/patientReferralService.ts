
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { mapReferralData } from './referralMappers';

export const fetchPatientReferrals = async (patientId: string): Promise<Referral[]> => {
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
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patient referrals:', error);
      return [];
    }

    return referrals.map(mapReferralData);
  } catch (error) {
    console.error('Error fetching patient referrals:', error);
    return [];
  }
};

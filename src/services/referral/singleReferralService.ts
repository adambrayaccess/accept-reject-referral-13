
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
        attachments(*)
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

    console.log('Successfully fetched referral:', referral.id);
    return mapReferralData(referral);
  } catch (error) {
    console.error('Error fetching referral:', error);
    return null;
  }
};

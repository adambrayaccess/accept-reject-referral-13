
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { mapReferralData } from './referralMappers';

export const fetchPatientReferrals = async (patientId: string): Promise<Referral[]> => {
  try {
    console.log(`Fetching referrals for patient: ${patientId}`);
    
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
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patient referrals:', error);
      return [];
    }

    console.log(`Successfully fetched ${referrals?.length || 0} referrals for patient`);
    return referrals ? referrals.map(mapReferralData) : [];
  } catch (error) {
    console.error('Error fetching patient referrals:', error);
    return [];
  }
};

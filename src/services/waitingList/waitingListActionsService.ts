import { supabase } from '@/integrations/supabase/client';

export interface DischargeFromWaitingListParams {
  referralId: string;
  specialty: string;
  performedBy: string;
  dischargeReason?: string;
}

export interface CompleteReferralPathwayParams {
  referralId: string;
  performedBy: string;
  completionReason?: string;
}

/**
 * Discharge a patient from the waiting list
 * This will:
 * - Update the waiting list entry status to 'removed'
 * - Update the referral status to 'discharged'
 * - Clear waiting list fields from referrals table
 * - Log the action in audit log and waiting list history
 */
export const dischargeFromWaitingList = async (params: DischargeFromWaitingListParams): Promise<boolean> => {
  const { referralId, specialty, performedBy, dischargeReason = 'Discharged from waiting list' } = params;
  
  try {
    console.log('Discharging from waiting list:', { referralId, specialty, performedBy, dischargeReason });
    
    const { data, error } = await supabase.rpc('discharge_from_waiting_list', {
      referral_id_param: referralId,
      specialty_param: specialty,
      performed_by_param: performedBy,
      discharge_reason: dischargeReason
    });

    if (error) {
      console.error('Error discharging from waiting list:', error);
      throw error;
    }

    if (!data) {
      console.error('No active waiting list entry found for discharge');
      throw new Error('No active waiting list entry found for this referral');
    }

    console.log('Successfully discharged from waiting list');
    return true;
  } catch (error) {
    console.error('Error in dischargeFromWaitingList:', error);
    throw error;
  }
};

/**
 * Complete a referral pathway
 * This will:
 * - Update the referral status to 'complete'
 * - Remove from waiting list if present
 * - Clear waiting list fields
 * - Log the action in audit log
 */
export const completeReferralPathway = async (params: CompleteReferralPathwayParams): Promise<boolean> => {
  const { referralId, performedBy, completionReason = 'Pathway completed' } = params;
  
  try {
    console.log('Completing referral pathway:', { referralId, performedBy, completionReason });
    
    const { data, error } = await supabase.rpc('complete_referral_pathway', {
      referral_id_param: referralId,
      performed_by_param: performedBy,
      completion_reason: completionReason
    });

    if (error) {
      console.error('Error completing referral pathway:', error);
      throw error;
    }

    console.log('Successfully completed referral pathway');
    return true;
  } catch (error) {
    console.error('Error in completeReferralPathway:', error);
    throw error;
  }
};

import { Referral } from '@/types/referral';
import { supabase } from '@/integrations/supabase/client';

// Create a sub-referral from a parent referral
export const createSubReferral = async (
  parentReferralId: string,
  subReferralData: {
    specialty: string;
    service?: string;
    reason: string;
    notes?: string;
    priority: 'routine' | 'urgent' | 'emergency';
  }
): Promise<Referral | null> => {
  try {
    // First, get the parent referral from the database
    const { data: parentReferral, error: parentError } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patients!inner(*),
        referrer:practitioners!inner(*)
      `)
      .eq('id', parentReferralId)
      .single();

    if (parentError || !parentReferral) {
      console.error('Parent referral not found:', parentError);
      return null;
    }

    // Generate new IDs for the sub-referral
    const newUbrn = `SUB-${Date.now()}`;
    
    // Create the sub-referral in the database
    const { data: newSubReferral, error: insertError } = await supabase
      .from('referrals')
      .insert({
        ubrn: newUbrn,
        patient_id: parentReferral.patient_id,
        referrer_id: parentReferral.referrer_id,
        specialty: subReferralData.specialty,
        service: subReferralData.service,
        reason: subReferralData.reason,
        notes: subReferralData.notes,
        priority: subReferralData.priority,
        status: 'new',
        parent_referral_id: parentReferralId,
        is_sub_referral: true,
        history: parentReferral.history || '',
        diagnosis: parentReferral.diagnosis || '',
        medications: parentReferral.medications || '',
        allergies_info: parentReferral.allergies_info
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating sub-referral:', insertError);
      return null;
    }

    // Add audit log entry for the sub-referral creation
    await supabase
      .from('audit_log')
      .insert({
        referral_id: newSubReferral.id,
        action: `Sub-referral created from parent referral ${parentReferralId}`,
        user_name: 'Current User',
        notes: subReferralData.notes
      });

    // Add audit log entry to the parent referral
    await supabase
      .from('audit_log')
      .insert({
        referral_id: parentReferralId,
        action: `Sub-referral created: ${newSubReferral.id} to ${subReferralData.specialty}`,
        user_name: 'Current User',
        notes: subReferralData.notes
      });

    console.log(`Sub-referral ${newSubReferral.id} created for parent ${parentReferralId}`);
    
    // Return the created sub-referral with proper structure
    return {
      id: newSubReferral.id,
      ubrn: newSubReferral.ubrn,
      created: newSubReferral.created_at,
      status: newSubReferral.status,
      priority: newSubReferral.priority,
      patient: parentReferral.patient,
      referrer: parentReferral.referrer,
      specialty: newSubReferral.specialty,
      service: newSubReferral.service,
      clinicalInfo: {
        reason: newSubReferral.reason,
        notes: newSubReferral.notes,
        history: newSubReferral.history || '',
        diagnosis: newSubReferral.diagnosis || '',
        medications: newSubReferral.medications || '',
        allergies: newSubReferral.allergies_info || '',
      },
      attachments: [],
      parentReferralId: parentReferralId,
      isSubReferral: true,
      auditLog: []
    } as Referral;

  } catch (error) {
    console.error('Error in createSubReferral:', error);
    return null;
  }
};

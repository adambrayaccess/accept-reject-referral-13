import { supabase } from '@/integrations/supabase/client';

export interface AddToWaitingListParams {
  referralId: string;
  specialty: string;
  performedBy: string;
  notes?: string;
}

export interface WaitingListEntry {
  id: string;
  referral_id: string;
  specialty: string;
  position: number;
  added_date: string;
  added_by: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Add a referral to the waiting list
 * This will:
 * - Create a waiting list entry
 * - Update the referral's triage status to 'waiting-list'
 * - Update waiting list fields in the referrals table
 * - Log the action in audit log
 */
export const addToWaitingList = async (params: AddToWaitingListParams): Promise<boolean> => {
  const { referralId, specialty, performedBy, notes } = params;
  
  try {
    console.log('Adding to waiting list:', { referralId, specialty, performedBy, notes });
    
    const { data, error } = await supabase.rpc('add_to_waiting_list', {
      referral_id_param: referralId,
      specialty_param: specialty,
      performed_by_param: performedBy,
      notes_param: notes || null
    });

    if (error) {
      console.error('Error adding to waiting list:', error);
      throw error;
    }

    if (!data) {
      console.error('Failed to add to waiting list - referral may already be on waiting list');
      throw new Error('Failed to add to waiting list');
    }

    console.log('Successfully added to waiting list');
    
    // Emit custom event for real-time updates
    window.dispatchEvent(new CustomEvent('referralUpdated', { 
      detail: { referralId, action: 'addedToWaitingList', specialty } 
    }));
    
    return true;
  } catch (error) {
    console.error('Error in addToWaitingList:', error);
    throw error;
  }
};

/**
 * Get waiting list entries for a specialty
 */
export const getWaitingListEntries = async (specialty?: string): Promise<WaitingListEntry[]> => {
  try {
    let query = supabase
      .from('waiting_list_entries')
      .select('*')
      .eq('status', 'active')
      .order('position', { ascending: true });
    
    if (specialty) {
      query = query.eq('specialty', specialty);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching waiting list entries:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getWaitingListEntries:', error);
    throw error;
  }
};

/**
 * Get waiting list position for a specific referral
 */
export const getWaitingListPosition = async (referralId: string, specialty: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('waiting_list_entries')
      .select('position')
      .eq('referral_id', referralId)
      .eq('specialty', specialty)
      .eq('status', 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching waiting list position:', error);
      throw error;
    }
    
    return data?.position || null;
  } catch (error) {
    console.error('Error in getWaitingListPosition:', error);
    throw error;
  }
};

/**
 * Check if a referral is on the waiting list
 */
export const isOnWaitingList = async (referralId: string, specialty: string): Promise<boolean> => {
  try {
    const position = await getWaitingListPosition(referralId, specialty);
    return position !== null;
  } catch (error) {
    console.error('Error checking waiting list status:', error);
    return false;
  }
};

/**
 * Remove a referral from the waiting list (used internally by discharge/complete functions)
 */
export const removeFromWaitingList = async (referralId: string, specialty: string, performedBy: string, reason: string): Promise<boolean> => {
  try {
    console.log('Removing from waiting list:', { referralId, specialty, performedBy, reason });
    
    // Update the waiting list entry status to 'removed'
    const { error: updateError } = await supabase
      .from('waiting_list_entries')
      .update({
        status: 'removed',
        notes: reason,
        updated_at: new Date().toISOString()
      })
      .eq('referral_id', referralId)
      .eq('specialty', specialty)
      .eq('status', 'active');
    
    if (updateError) {
      console.error('Error updating waiting list entry:', updateError);
      throw updateError;
    }
    
    // Clear waiting list fields from referrals table
    const { error: referralError } = await supabase
      .from('referrals')
      .update({
        waiting_list_position: null,
        waiting_list_added_date: null,
        waiting_list_priority_override: null,
        waiting_list_notes: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', referralId);
    
    if (referralError) {
      console.error('Error clearing waiting list fields:', referralError);
      throw referralError;
    }
    
    console.log('Successfully removed from waiting list');
    
    // Emit custom event for real-time updates
    window.dispatchEvent(new CustomEvent('referralUpdated', { 
      detail: { referralId, action: 'removedFromWaitingList', specialty } 
    }));
    
    return true;
  } catch (error) {
    console.error('Error in removeFromWaitingList:', error);
    throw error;
  }
};
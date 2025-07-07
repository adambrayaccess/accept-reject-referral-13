import { supabase } from '@/integrations/supabase/client';
import { RTTPathway, CarePathway } from '@/types/pathway';

// RTT Pathway Services
export const fetchRTTPathway = async (referralId: string): Promise<RTTPathway | null> => {
  try {
    const { data, error } = await supabase
      .from('rtt_pathways')
      .select('*')
      .eq('referral_id', referralId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, which is fine
        return null;
      }
      throw error;
    }

    return {
      id: data.id,
      referralId: data.referral_id,
      clockStart: data.clock_start_date,
      targetDate: data.target_date,
      status: data.status,
      breachRisk: data.breach_risk,
      daysRemaining: data.days_remaining,
      pauseHistory: data.pause_history || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching RTT pathway:', error);
    return null;
  }
};

export const createOrUpdateRTTPathway = async (referralId: string, clockStartDate?: string): Promise<RTTPathway | null> => {
  try {
    // First check if RTT pathway already exists
    const existing = await fetchRTTPathway(referralId);
    if (existing) {
      return existing;
    }

    // Get referral data to determine clock start date
    const { data: referral } = await supabase
      .from('referrals')
      .select('created_at, status')
      .eq('id', referralId)
      .single();

    if (!referral) {
      throw new Error('Referral not found');
    }

    const clockStart = clockStartDate || referral.created_at;
    const status = referral.status === 'discharged' ? 'completed' : 
                  referral.status === 'cancelled' ? 'discontinued' : 'active';

    const { data, error } = await supabase
      .from('rtt_pathways')
      .insert({
        referral_id: referralId,
        clock_start_date: clockStart,
        status
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      referralId: data.referral_id,
      clockStart: data.clock_start_date,
      targetDate: data.target_date,
      status: data.status,
      breachRisk: data.breach_risk,
      daysRemaining: data.days_remaining,
      pauseHistory: data.pause_history || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating/updating RTT pathway:', error);
    return null;
  }
};

export const updateRTTPathwayStatus = async (referralId: string, status: RTTPathway['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('rtt_pathways')
      .update({ status })
      .eq('referral_id', referralId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating RTT pathway status:', error);
    return false;
  }
};

export const addRTTPathwayPause = async (
  referralId: string, 
  reason: string, 
  pausedBy: string
): Promise<boolean> => {
  try {
    const pathway = await fetchRTTPathway(referralId);
    if (!pathway) return false;

    const pauseHistory = pathway.pauseHistory || [];
    pauseHistory.push({
      startDate: new Date().toISOString(),
      reason,
      pausedBy
    });

    const { error } = await supabase
      .from('rtt_pathways')
      .update({ 
        status: 'paused',
        pause_history: pauseHistory 
      })
      .eq('referral_id', referralId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding RTT pathway pause:', error);
    return false;
  }
};

// Care Pathway Services
export const fetchCarePathway = async (referralId: string): Promise<CarePathway | null> => {
  try {
    const { data, error } = await supabase
      .from('care_pathways')
      .select('*')
      .eq('referral_id', referralId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, which is fine
        return null;
      }
      throw error;
    }

    return {
      id: data.id,
      referralId: data.referral_id,
      name: data.name,
      status: data.status,
      description: data.description,
      targetTimeframe: data.target_timeframe,
      priorityLevel: data.priority_level,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching care pathway:', error);
    return null;
  }
};

export const createCarePathway = async (
  referralId: string,
  name: string,
  description?: string,
  targetTimeframe?: string,
  priorityLevel?: CarePathway['priorityLevel']
): Promise<CarePathway | null> => {
  try {
    const { data, error } = await supabase
      .from('care_pathways')
      .insert({
        referral_id: referralId,
        name,
        description,
        target_timeframe: targetTimeframe,
        priority_level: priorityLevel || 'standard'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      referralId: data.referral_id,
      name: data.name,
      status: data.status,
      description: data.description,
      targetTimeframe: data.target_timeframe,
      priorityLevel: data.priority_level,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating care pathway:', error);
    return null;
  }
};

export const updateCarePathwayStatus = async (
  referralId: string, 
  status: CarePathway['status']
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('care_pathways')
      .update({ status })
      .eq('referral_id', referralId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating care pathway status:', error);
    return false;
  }
};
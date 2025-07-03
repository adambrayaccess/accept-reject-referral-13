import { supabase } from '@/integrations/supabase/client';

export interface PinnedReferral {
  id: string;
  user_id: string;
  referral_id: string;
  pinned_at: string;
  created_at: string;
}

export class PinningService {
  // Pin a referral for the current user
  static async pinReferral(referralId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('pinned_referrals')
        .insert({
          user_id: user.id,
          referral_id: referralId
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { success: false, error: 'Referral is already pinned' };
        }
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error pinning referral:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to pin referral' 
      };
    }
  }

  // Unpin a referral for the current user
  static async unpinReferral(referralId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('pinned_referrals')
        .delete()
        .eq('user_id', user.id)
        .eq('referral_id', referralId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error unpinning referral:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to unpin referral' 
      };
    }
  }

  // Check if a referral is pinned by the current user
  static async isReferralPinned(referralId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      const { data, error } = await supabase
        .from('pinned_referrals')
        .select('id')
        .eq('user_id', user.id)
        .eq('referral_id', referralId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking if referral is pinned:', error);
      return false;
    }
  }

  // Get all pinned referrals for the current user
  static async getPinnedReferralIds(): Promise<string[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('pinned_referrals')
        .select('referral_id')
        .eq('user_id', user.id)
        .order('pinned_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(item => item.referral_id);
    } catch (error) {
      console.error('Error fetching pinned referrals:', error);
      return [];
    }
  }

  // Get pinned referrals with full referral data
  static async getPinnedReferralsWithData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('pinned_referrals')
        .select(`
          *,
          referrals!inner(
            *,
            patient:patients!inner(*),
            referrer:practitioners!inner(*)
          )
        `)
        .eq('user_id', user.id)
        .order('pinned_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching pinned referrals with data:', error);
      return [];
    }
  }
}
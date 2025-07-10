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
        console.log('No authenticated user found');
        return [];
      }

      const { data, error } = await supabase
        .from('pinned_referrals')
        .select('referral_id')
        .eq('user_id', user.id)
        .order('pinned_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching pinned referrals:', error);
        throw error;
      }

      const referralIds = data.map(item => item.referral_id);

      return referralIds;
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
            attachments(*),
            rtt_pathways(*),
            care_pathways(*)
          )
        `)
        .eq('user_id', user.id)
        .order('pinned_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Now we need to fetch child referrals for each pinned referral (similar to bulk service)
      if (data && data.length > 0) {
        // Get all parent referral IDs from pinned referrals
        const parentReferralIds = data
          .filter(item => !item.referrals.is_sub_referral)
          .map(item => item.referrals.id);
        
        console.log('Pinned parent referral IDs:', parentReferralIds);
        
        if (parentReferralIds.length > 0) {
          // Fetch child referral information
          const { data: childReferrals, error: childError } = await supabase
            .from('referrals')
            .select('id, parent_referral_id, specialty, triage_status')
            .in('parent_referral_id', parentReferralIds);
          
          console.log('Pinned service child referrals:', { childReferrals, childError });
          
          if (!childError && childReferrals) {
            // Group child referrals by parent ID
            const childrenByParent = childReferrals.reduce((acc, child) => {
              if (!acc[child.parent_referral_id]) {
                acc[child.parent_referral_id] = [];
              }
              acc[child.parent_referral_id].push(child);
              return acc;
            }, {} as Record<string, any[]>);
            
            console.log('Pinned service children grouped:', childrenByParent);
            
            // Update parent referrals with their child IDs
            data.forEach(item => {
              if (!item.referrals.is_sub_referral) {
                if (childrenByParent[item.referrals.id]) {
                  item.referrals.childReferralIds = childrenByParent[item.referrals.id].map(child => child.id);
                  console.log(`Pinned Service: Parent referral ${item.referrals.id} now has child IDs:`, item.referrals.childReferralIds);
                } else {
                  // Initialize as empty array if no children found
                  item.referrals.childReferralIds = [];
                  console.log(`Pinned Service: Parent referral ${item.referrals.id} has no children, initialized empty array`);
                }
              }
            });
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Error fetching pinned referrals with data:', error);
      return [];
    }
  }
}
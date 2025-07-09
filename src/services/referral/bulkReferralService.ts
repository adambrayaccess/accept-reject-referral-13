
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { mapReferralData } from './referralMappers';

export const fetchReferrals = async (filters?: {
  specialty?: string;
  specialties?: string[];
  status?: string;
  triageStatus?: string;
  excludeStatuses?: string[];
  waitingListIncludeDischargedFilter?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Referral[]> => {
  try {
    console.log('Fetching referrals with filters:', filters);
    
    let query = supabase
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
        attachments(*),
        rtt_pathways(*),
        care_pathways(*)
      `);

    // Apply filters
    if (filters?.specialty) {
      query = query.eq('specialty', filters.specialty);
    }
    
    // Apply multiple specialties filter
    if (filters?.specialties && filters.specialties.length > 0) {
      query = query.in('specialty', filters.specialties);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.triageStatus) {
      query = query.eq('triage_status', filters.triageStatus);
    }
    
    // Handle waiting list with discharged referrals filter
    if (filters?.waitingListIncludeDischargedFilter) {
      // Include both active waiting list referrals and discharged referrals
      query = query.or('triage_status.eq.waiting-list,status.eq.discharged');
    }
    
    // Exclude specific statuses
    if (filters?.excludeStatuses && filters.excludeStatuses.length > 0) {
      query = query.not('status', 'in', `(${filters.excludeStatuses.join(',')})`);
    }
    
    // Apply pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
    }
    
    // Order by display_order first, then created_at
    query = query.order('display_order', { ascending: true })
                 .order('created_at', { ascending: false });

    const { data: referrals, error } = await query;

    if (error) {
      console.error('Error fetching referrals:', error);
      return [];
    }

    console.log(`Successfully fetched ${referrals?.length || 0} referrals`);
    
    // Map referrals and populate child referral IDs for parent referrals
    const mappedReferrals = referrals ? referrals.map(mapReferralData) : [];
    
    // Get all parent referral IDs
    const parentReferralIds = mappedReferrals
      .filter(ref => !ref.isSubReferral)
      .map(ref => ref.id);
    
    if (parentReferralIds.length > 0) {
      // Fetch child referral information in bulk
      const { data: childReferrals, error: childError } = await supabase
        .from('referrals')
        .select('id, parent_referral_id, specialty, triage_status')
        .in('parent_referral_id', parentReferralIds);
      
      if (!childError && childReferrals) {
        // Group child referrals by parent ID
        const childrenByParent = childReferrals.reduce((acc, child) => {
          if (!acc[child.parent_referral_id]) {
            acc[child.parent_referral_id] = [];
          }
          acc[child.parent_referral_id].push(child);
          return acc;
        }, {} as Record<string, any[]>);
        
    // Update parent referrals with their child IDs
        mappedReferrals.forEach(referral => {
          if (!referral.isSubReferral && childrenByParent[referral.id]) {
            referral.childReferralIds = childrenByParent[referral.id].map(child => child.id);
            console.log(`Bulk Service: Parent referral ${referral.id} now has child IDs:`, referral.childReferralIds);
          }
        });
      }
    }
    
    return mappedReferrals;
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return [];
  }
};

export const fetchReferralsBySpecialties = async (specialties: string[]): Promise<Referral[]> => {
  if (specialties.length === 0) {
    return fetchReferrals();
  }
  
  return fetchReferrals({ 
    specialty: specialties.length === 1 ? specialties[0] : undefined,
    specialties: specialties.length > 1 ? specialties : undefined
  });
};

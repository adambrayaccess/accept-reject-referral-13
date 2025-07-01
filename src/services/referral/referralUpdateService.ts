
import { supabase } from '@/integrations/supabase/client';
import { Referral, TriageStatus } from '@/types/referral';
import { fetchReferralById } from './referralFetchService';

interface TeamAllocationData {
  teamId?: string;
  assignedHCPId?: string;
  triageStatus?: TriageStatus;
}

export const updateReferralStatus = async (
  referralId: string, 
  status: 'accepted' | 'rejected', 
  notes?: string,
  teamAllocationData?: TeamAllocationData
): Promise<boolean> => {
  try {
    console.log(`Updating referral ${referralId} status to ${status}`);
    
    // Start a transaction-like operation
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    // Handle team allocation if provided
    if (teamAllocationData) {
      if (teamAllocationData.teamId) {
        updates.team_id = teamAllocationData.teamId;
        updates.allocated_date = new Date().toISOString();
        updates.allocated_by = 'Current User'; // In real app, get from auth context
      }
      
      if (teamAllocationData.assignedHCPId) {
        updates.assigned_hcp_id = teamAllocationData.assignedHCPId;
      }
      
      if (teamAllocationData.triageStatus) {
        updates.triage_status = teamAllocationData.triageStatus;
      }
    }
    
    // Update the referral
    const { error: updateError } = await supabase
      .from('referrals')
      .update(updates)
      .eq('id', referralId);
    
    if (updateError) {
      console.error('Error updating referral:', updateError);
      return false;
    }
    
    // Add audit log entry
    const auditEntry = {
      referral_id: referralId,
      timestamp: new Date().toISOString(),
      user_name: 'Current User', // In real app, get from auth context
      action: `Referral ${status}`,
      notes: notes || null
    };
    
    const { error: auditError } = await supabase
      .from('audit_log')
      .insert([auditEntry]);
      
    if (auditError) {
      console.error('Error adding audit log:', auditError);
      // Don't fail the main operation for audit log issues
    }
    
    // Emit custom event for real-time updates
    window.dispatchEvent(new CustomEvent('referralUpdated', { 
      detail: { referralId, status } 
    }));
    
    console.log(`Successfully updated referral ${referralId} status to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating referral status:', error);
    return false;
  }
};

export const updateTriageStatus = async (
  referralId: string,
  triageStatus: TriageStatus,
  notes?: string,
  teamAllocationData?: TeamAllocationData
): Promise<boolean> => {
  try {
    console.log(`Updating referral ${referralId} triage status to ${triageStatus}`);
    
    const updates: any = {
      triage_status: triageStatus,
      updated_at: new Date().toISOString()
    };
    
    // Handle team allocation if provided
    if (teamAllocationData) {
      if (teamAllocationData.teamId) {
        updates.team_id = teamAllocationData.teamId;
        if (!updates.allocated_date) {
          updates.allocated_date = new Date().toISOString();
          updates.allocated_by = 'Current User'; // In real app, get from auth context
        }
      }
      
      if (teamAllocationData.assignedHCPId) {
        updates.assigned_hcp_id = teamAllocationData.assignedHCPId;
      }
    }
    
    // Update the referral
    const { error: updateError } = await supabase
      .from('referrals')
      .update(updates)
      .eq('id', referralId);
    
    if (updateError) {
      console.error('Error updating triage status:', updateError);
      return false;
    }
    
    // Add audit log entry
    let auditAction = `Triage status updated to ${triageStatus}`;
    if (teamAllocationData?.teamId || teamAllocationData?.assignedHCPId) {
      if (teamAllocationData.assignedHCPId) {
        auditAction += ' with HCP assignment';
      } else if (teamAllocationData.teamId) {
        auditAction += ' with team allocation';
      }
    }
    
    const auditEntry = {
      referral_id: referralId,
      timestamp: new Date().toISOString(),
      user_name: 'Current User', // In real app, get from auth context
      action: auditAction,
      notes: notes || null
    };
    
    const { error: auditError } = await supabase
      .from('audit_log')
      .insert([auditEntry]);
      
    if (auditError) {
      console.error('Error adding audit log:', auditError);
      // Don't fail the main operation for audit log issues
    }
    
    // Emit custom event for real-time updates
    window.dispatchEvent(new CustomEvent('referralUpdated', { 
      detail: { referralId, triageStatus } 
    }));
    
    console.log(`Successfully updated referral ${referralId} triage status to ${triageStatus}`);
    return true;
  } catch (error) {
    console.error('Error updating triage status:', error);
    return false;
  }
};

export const updateReferralTags = async (
  referralId: string,
  tags: string[]
): Promise<boolean> => {
  try {
    console.log(`Updating referral ${referralId} tags:`, tags);
    
    // Delete existing tags
    const { error: deleteError } = await supabase
      .from('referral_tags')
      .delete()
      .eq('referral_id', referralId);
      
    if (deleteError) {
      console.error('Error deleting existing tags:', deleteError);
      return false;
    }
    
    // Insert new tags
    if (tags.length > 0) {
      const tagInserts = tags.map(tag => ({
        referral_id: referralId,
        tag: tag
      }));
      
      const { error: insertError } = await supabase
        .from('referral_tags')
        .insert(tagInserts);
        
      if (insertError) {
        console.error('Error inserting new tags:', insertError);
        return false;
      }
    }
    
    // Add audit log entry
    const auditEntry = {
      referral_id: referralId,
      timestamp: new Date().toISOString(),
      user_name: 'Current User', // In real app, get from auth context
      action: 'Tags updated',
      notes: `Tags set to: ${tags.join(', ')}`
    };
    
    const { error: auditError } = await supabase
      .from('audit_log')
      .insert([auditEntry]);
      
    if (auditError) {
      console.error('Error adding audit log:', auditError);
      // Don't fail the main operation for audit log issues
    }
    
    // Emit custom event for real-time updates
    window.dispatchEvent(new CustomEvent('referralUpdated', { 
      detail: { referralId, tags } 
    }));
    
    console.log(`Successfully updated referral ${referralId} tags`);
    return true;
  } catch (error) {
    console.error('Error updating referral tags:', error);
    return false;
  }
};

// Mock data store is no longer needed - remove this legacy function
export const setReferralsData = (data: Referral[]) => {
  console.warn('setReferralsData is deprecated - data is now managed by Supabase');
};

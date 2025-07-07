
import { supabase } from '@/integrations/supabase/client';
import { Referral, TriageStatus } from '@/types/referral';
import { fetchReferralById } from './referralFetchService';
import { assignHCPToTeam } from '@/services/teamService';
import { addToWaitingList } from '@/services/waitingList/waitingListEntriesService';

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
        
        // Also assign the HCP to the team if both are specified
        if (teamAllocationData.teamId) {
          try {
            await assignHCPToTeam(teamAllocationData.assignedHCPId, teamAllocationData.teamId);
          } catch (error) {
            console.error('Error assigning HCP to team:', error);
            // Don't fail the main operation for this
          }
        }
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
    
    // Get the current referral to check specialty
    const { data: referral } = await supabase
      .from('referrals')
      .select('specialty, triage_status')
      .eq('id', referralId)
      .single();
    
    if (!referral) {
      console.error('Referral not found');
      return false;
    }
    
    // If setting to waiting-list, use the waiting list service
    if (triageStatus === 'waiting-list' && referral.triage_status !== 'waiting-list') {
      try {
        await addToWaitingList({
          referralId,
          specialty: referral.specialty,
          performedBy: 'Current User', // In real app, get from auth context
          notes: notes || undefined
        });
        
        // Handle team allocation if provided
        if (teamAllocationData) {
          const teamUpdates: any = {};
          
          if (teamAllocationData.teamId) {
            teamUpdates.team_id = teamAllocationData.teamId;
            teamUpdates.allocated_date = new Date().toISOString();
            teamUpdates.allocated_by = 'Current User';
          }
          
          if (teamAllocationData.assignedHCPId) {
            teamUpdates.assigned_hcp_id = teamAllocationData.assignedHCPId;
          }
          
          if (Object.keys(teamUpdates).length > 0) {
            const { error: teamError } = await supabase
              .from('referrals')
              .update(teamUpdates)
              .eq('id', referralId);
            
            if (teamError) {
              console.error('Error updating team allocation:', teamError);
            }
          }
        }
        
        console.log(`Successfully added referral ${referralId} to waiting list`);
        return true;
      } catch (error) {
        console.error('Error adding to waiting list:', error);
        return false;
      }
    }
    
    // For other triage status updates, use regular update
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
export const updateReferralDetails = async (
  referralId: string,
  updates: {
    // Clinical fields
    specialty?: string;
    service?: string;
    assignedHCPId?: string;
    reason?: string;
    history?: string;
    diagnosis?: string;
    medications?: string;
    allergies_info?: string;
    notes?: string;
    // Referrer fields
    referralSource?: string;
    referralType?: string;
    patientAreaCareSetting?: string;
    externalReference?: string;
    camhsServiceTier?: string;
    // Patient fields
    overseasStatus?: string;
    administrativeCategory?: string;
  }
): Promise<boolean> => {
  try {
    console.log(`Updating referral ${referralId} details:`, updates);
    
    const dbUpdates: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Map field names to database column names and handle "none" values
    if (updates.assignedHCPId !== undefined) {
      dbUpdates.assigned_hcp_id = updates.assignedHCPId === 'none' ? null : updates.assignedHCPId;
      delete dbUpdates.assignedHCPId;
    }
    if (updates.referralSource !== undefined) {
      dbUpdates.referral_source = updates.referralSource === 'none' ? null : updates.referralSource;
      delete dbUpdates.referralSource;
    }
    if (updates.referralType !== undefined) {
      dbUpdates.referral_type = updates.referralType === 'none' ? null : updates.referralType;
      delete dbUpdates.referralType;
    }
    if (updates.patientAreaCareSetting !== undefined) {
      dbUpdates.patient_area_care_setting = updates.patientAreaCareSetting === 'none' ? null : updates.patientAreaCareSetting;
      delete dbUpdates.patientAreaCareSetting;
    }
    if (updates.externalReference !== undefined) {
      dbUpdates.external_reference = updates.externalReference === 'none' ? null : updates.externalReference;
      delete dbUpdates.externalReference;
    }
    if (updates.camhsServiceTier !== undefined) {
      dbUpdates.camhs_service_tier = updates.camhsServiceTier === 'none' ? null : updates.camhsServiceTier;
      delete dbUpdates.camhsServiceTier;
    }
    if (updates.overseasStatus !== undefined) {
      dbUpdates.overseas_status = updates.overseasStatus === 'none' ? null : updates.overseasStatus;
      delete dbUpdates.overseasStatus;
    }
    if (updates.administrativeCategory !== undefined) {
      dbUpdates.administrative_category = updates.administrativeCategory === 'none' ? null : updates.administrativeCategory;
      delete dbUpdates.administrativeCategory;
    }
    
    // Update the referral
    const { error: updateError } = await supabase
      .from('referrals')
      .update(dbUpdates)
      .eq('id', referralId);
    
    if (updateError) {
      console.error('Error updating referral details:', updateError);
      return false;
    }
    
    // Add audit log entry
    const auditEntry = {
      referral_id: referralId,
      timestamp: new Date().toISOString(),
      user_name: 'Current User', // In real app, get from auth context
      action: 'Referral details updated',
      notes: `Updated fields: ${Object.keys(updates).join(', ')}`
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
      detail: { referralId, updates } 
    }));
    
    console.log(`Successfully updated referral ${referralId} details`);
    return true;
  } catch (error) {
    console.error('Error updating referral details:', error);
    return false;
  }
};

// Mock data store is no longer needed - remove this legacy function
export const setReferralsData = (data: Referral[]) => {
  console.warn('setReferralsData is deprecated - data is now managed by Supabase');
};


import { Referral, TriageStatus } from '@/types/referral';
import { fetchReferralById } from './referralFetchService';

interface TeamAllocationData {
  teamId?: string;
  assignedHCPId?: string;
  triageStatus?: TriageStatus;
}

// Mock data store (in a real app, this would be a database)
let referrals: Referral[] = [];

export const updateReferralStatus = async (
  referralId: string, 
  status: 'accepted' | 'rejected', 
  notes?: string,
  teamAllocationData?: TeamAllocationData
): Promise<boolean> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // First, try to find the referral in our local store
    let referralIndex = referrals.findIndex(r => r.id === referralId);
    
    // If not found, fetch it from the main data source and add to local store
    if (referralIndex === -1) {
      console.log(`Referral ${referralId} not found in local store, fetching from main data source`);
      const fetchedReferral = await fetchReferralById(referralId);
      if (!fetchedReferral) {
        console.error(`Referral with ID ${referralId} not found in any data source`);
        return false;
      }
      referrals.push(fetchedReferral);
      referralIndex = referrals.length - 1;
    }
    
    const referral = referrals[referralIndex];
    
    // Update basic status
    referral.status = status;
    
    // Add audit log entry
    if (!referral.auditLog) {
      referral.auditLog = [];
    }
    
    const auditEntry = {
      timestamp: new Date().toISOString(),
      user: 'Current User', // In real app, get from auth context
      action: `Referral ${status}`,
      notes: notes || undefined
    };
    
    referral.auditLog.push(auditEntry);
    
    // Handle team allocation if provided
    if (teamAllocationData) {
      if (teamAllocationData.teamId) {
        referral.teamId = teamAllocationData.teamId;
        referral.allocatedDate = new Date().toISOString();
        referral.allocatedBy = 'Current User'; // In real app, get from auth context
      }
      
      if (teamAllocationData.assignedHCPId) {
        referral.assignedHCPId = teamAllocationData.assignedHCPId;
      }
      
      if (teamAllocationData.triageStatus) {
        referral.triageStatus = teamAllocationData.triageStatus;
      }
    }
    
    console.log(`Referral ${referralId} status updated to ${status}`, referral);
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
    console.log(`Attempting to update triage status for referral ${referralId} to ${triageStatus}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // First, try to find the referral in our local store
    let referralIndex = referrals.findIndex(r => r.id === referralId);
    
    // If not found, fetch it from the main data source and add to local store
    if (referralIndex === -1) {
      console.log(`Referral ${referralId} not found in local store, fetching from main data source`);
      const fetchedReferral = await fetchReferralById(referralId);
      if (!fetchedReferral) {
        console.error(`Referral with ID ${referralId} not found in any data source`);
        return false;
      }
      referrals.push(fetchedReferral);
      referralIndex = referrals.length - 1;
    }
    
    const referral = referrals[referralIndex];
    
    // Update triage status
    referral.triageStatus = triageStatus;
    
    // Handle team allocation if provided
    if (teamAllocationData) {
      if (teamAllocationData.teamId) {
        referral.teamId = teamAllocationData.teamId;
        if (!referral.allocatedDate) {
          referral.allocatedDate = new Date().toISOString();
          referral.allocatedBy = 'Current User'; // In real app, get from auth context
        }
      }
      
      if (teamAllocationData.assignedHCPId) {
        referral.assignedHCPId = teamAllocationData.assignedHCPId;
      }
    }
    
    // Add audit log entry
    if (!referral.auditLog) {
      referral.auditLog = [];
    }
    
    let auditAction = `Triage status updated to ${triageStatus}`;
    if (teamAllocationData?.teamId || teamAllocationData?.assignedHCPId) {
      if (teamAllocationData.assignedHCPId) {
        auditAction += ' with HCP assignment';
      } else if (teamAllocationData.teamId) {
        auditAction += ' with team allocation';
      }
    }
    
    const auditEntry = {
      timestamp: new Date().toISOString(),
      user: 'Current User', // In real app, get from auth context
      action: auditAction,
      notes: notes || undefined
    };
    
    referral.auditLog.push(auditEntry);
    
    console.log(`Referral ${referralId} triage status updated to ${triageStatus}`, referral);
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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // First, try to find the referral in our local store
    let referralIndex = referrals.findIndex(r => r.id === referralId);
    
    // If not found, fetch it from the main data source and add to local store
    if (referralIndex === -1) {
      console.log(`Referral ${referralId} not found in local store, fetching from main data source`);
      const fetchedReferral = await fetchReferralById(referralId);
      if (!fetchedReferral) {
        console.error(`Referral with ID ${referralId} not found in any data source`);
        return false;
      }
      referrals.push(fetchedReferral);
      referralIndex = referrals.length - 1;
    }
    
    const referral = referrals[referralIndex];
    
    // Update tags
    referral.tags = tags;
    
    // Add audit log entry
    if (!referral.auditLog) {
      referral.auditLog = [];
    }
    
    const auditEntry = {
      timestamp: new Date().toISOString(),
      user: 'Current User', // In real app, get from auth context
      action: `Tags updated`,
      notes: `Tags set to: ${tags.join(', ')}`
    };
    
    referral.auditLog.push(auditEntry);
    
    console.log(`Referral ${referralId} tags updated`, referral);
    return true;
  } catch (error) {
    console.error('Error updating referral tags:', error);
    return false;
  }
};

// Initialize with mock data if needed
export const setReferralsData = (data: Referral[]) => {
  referrals = data;
};

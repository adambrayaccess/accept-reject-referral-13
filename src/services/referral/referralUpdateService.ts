
import { Referral, TriageStatus } from '@/types/referral';

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
    
    const referralIndex = referrals.findIndex(r => r.id === referralId);
    if (referralIndex === -1) {
      console.error(`Referral with ID ${referralId} not found`);
      return false;
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

// Initialize with mock data if needed
export const setReferralsData = (data: Referral[]) => {
  referrals = data;
};

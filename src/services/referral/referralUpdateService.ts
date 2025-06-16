
import { ReferralStatus, TriageStatus } from '@/types/referral';
import { mockReferrals } from '../mockData';

const MOCK_DELAY = 1000;

// Update referral status
export const updateReferralStatus = async (
  referralId: string, 
  status: ReferralStatus, 
  notes?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referralIndex = mockReferrals.findIndex(ref => ref.id === referralId);
      if (referralIndex !== -1) {
        mockReferrals[referralIndex].status = status;
        console.log(`Referral ${referralId} status updated to ${status}. Notes: ${notes || 'None'}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, MOCK_DELAY);
  });
};

// Update triage status
export const updateTriageStatus = async (
  referralId: string,
  triageStatus: TriageStatus,
  notes?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referralIndex = mockReferrals.findIndex(ref => ref.id === referralId);
      if (referralIndex !== -1) {
        mockReferrals[referralIndex].triageStatus = triageStatus;
        
        // Add to audit log
        if (!mockReferrals[referralIndex].auditLog) {
          mockReferrals[referralIndex].auditLog = [];
        }
        
        mockReferrals[referralIndex].auditLog.push({
          timestamp: new Date().toISOString(),
          user: 'Current User',
          action: `Triage status updated to ${triageStatus}`,
          notes: notes || undefined
        });
        
        console.log(`Referral ${referralId} triage status updated to ${triageStatus}. Notes: ${notes || 'None'}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, MOCK_DELAY);
  });
};

// Update referral tags
export const updateReferralTags = async (
  referralId: string,
  tags: string[]
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referralIndex = mockReferrals.findIndex(ref => ref.id === referralId);
      if (referralIndex !== -1) {
        mockReferrals[referralIndex].tags = tags;
        
        // Add to audit log
        if (!mockReferrals[referralIndex].auditLog) {
          mockReferrals[referralIndex].auditLog = [];
        }
        
        mockReferrals[referralIndex].auditLog.push({
          timestamp: new Date().toISOString(),
          user: 'Current User',
          action: `Tags updated: ${tags.join(', ')}`,
        });
        
        console.log(`Referral ${referralId} tags updated:`, tags);
        resolve(true);
      } else {
        resolve(false);
      }
    }, MOCK_DELAY);
  });
};

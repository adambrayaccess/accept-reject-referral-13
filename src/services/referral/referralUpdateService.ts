
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
        const referral = mockReferrals[referralIndex];
        const oldStatus = referral.status;
        const oldTriageStatus = referral.triageStatus;
        
        // Update status
        referral.status = status;
        
        // Handle automatic triage status transitions
        if (status === 'accepted' && oldStatus === 'new') {
          // When accepting a new referral, set to assessed
          referral.triageStatus = 'assessed';
        } else if (status === 'rejected') {
          // When rejecting, set appropriate triage status
          referral.triageStatus = 'refer-to-another-specialty';
        }
        
        // Add to audit log
        if (!referral.auditLog) {
          referral.auditLog = [];
        }
        
        referral.auditLog.push({
          timestamp: new Date().toISOString(),
          user: 'Current User',
          action: `Status updated from ${oldStatus} to ${status}${referral.triageStatus !== oldTriageStatus ? `, triage status updated to ${referral.triageStatus}` : ''}`,
          notes: notes || undefined
        });
        
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
        const referral = mockReferrals[referralIndex];
        const oldTriageStatus = referral.triageStatus;
        
        // Update triage status
        referral.triageStatus = triageStatus;
        
        // Handle automatic status transitions
        if (triageStatus === 'waiting-list' && referral.status === 'new') {
          // When moving to waiting list, ensure status is accepted
          referral.status = 'accepted';
        } else if (triageStatus === 'refer-to-another-specialty') {
          // When referring elsewhere, set status to rejected
          referral.status = 'rejected';
        }
        
        // Add to audit log
        if (!referral.auditLog) {
          referral.auditLog = [];
        }
        
        referral.auditLog.push({
          timestamp: new Date().toISOString(),
          user: 'Current User',
          action: `Triage status updated from ${oldTriageStatus} to ${triageStatus}`,
          notes: notes || undefined
        });
        
        console.log(`Referral ${referralId} triage status updated to ${triageStatus}. Notes: ${notes || 'None'}`);
        
        // Trigger a custom event for real-time updates across components
        window.dispatchEvent(new CustomEvent('referralUpdated', { 
          detail: { referralId, triageStatus, status: referral.status } 
        }));
        
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

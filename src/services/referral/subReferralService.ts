
import { Referral } from '@/types/referral';
import { mockReferrals } from '../mockData';

const MOCK_DELAY = 1000;

// Create a sub-referral from a parent referral
export const createSubReferral = async (
  parentReferralId: string,
  subReferralData: {
    specialty: string;
    service?: string;
    reason: string;
    notes?: string;
    priority: 'routine' | 'urgent' | 'emergency';
  }
): Promise<Referral | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const parentReferral = mockReferrals.find(ref => ref.id === parentReferralId);
      
      if (!parentReferral || parentReferral.status !== 'accepted') {
        resolve(null);
        return;
      }

      const newSubReferralId = `SUB-${Date.now()}`;
      const newUbrn = `UBRN-${Date.now()}`;
      
      const subReferral: Referral = {
        id: newSubReferralId,
        ubrn: newUbrn,
        created: new Date().toISOString(),
        status: 'new',
        priority: subReferralData.priority,
        patient: parentReferral.patient,
        referrer: parentReferral.referrer,
        specialty: subReferralData.specialty,
        service: subReferralData.service,
        clinicalInfo: {
          reason: subReferralData.reason,
          notes: subReferralData.notes,
          history: parentReferral.clinicalInfo.history,
          diagnosis: parentReferral.clinicalInfo.diagnosis,
          medications: parentReferral.clinicalInfo.medications,
          allergies: parentReferral.clinicalInfo.allergies,
        },
        attachments: [],
        parentReferralId: parentReferralId,
        isSubReferral: true,
        auditLog: [{
          timestamp: new Date().toISOString(),
          user: 'Current User',
          action: `Sub-referral created from parent referral ${parentReferralId}`,
          notes: subReferralData.notes
        }]
      };

      // Add to mock data
      mockReferrals.push(subReferral);
      
      // Update parent referral with child reference
      const parentIndex = mockReferrals.findIndex(ref => ref.id === parentReferralId);
      if (parentIndex !== -1) {
        if (!mockReferrals[parentIndex].childReferralIds) {
          mockReferrals[parentIndex].childReferralIds = [];
        }
        mockReferrals[parentIndex].childReferralIds.push(newSubReferralId);
        
        // Add audit log entry to parent
        if (!mockReferrals[parentIndex].auditLog) {
          mockReferrals[parentIndex].auditLog = [];
        }
        mockReferrals[parentIndex].auditLog.push({
          timestamp: new Date().toISOString(),
          user: 'Current User',
          action: `Sub-referral created: ${newSubReferralId} to ${subReferralData.specialty}`,
          notes: subReferralData.notes
        });
      }

      console.log(`Sub-referral ${newSubReferralId} created for parent ${parentReferralId}`);
      resolve(subReferral);
    }, MOCK_DELAY);
  });
};

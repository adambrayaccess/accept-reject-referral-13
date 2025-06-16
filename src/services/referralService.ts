
import { Referral, ReferralStatus, TriageStatus } from '@/types/referral';
import { mockReferrals } from './mockData';

const MOCK_DELAY = 1000;

// Get all referrals
export const fetchReferrals = async (): Promise<Referral[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReferrals);
    }, MOCK_DELAY);
  });
};

// Get single referral by ID
export const fetchReferralById = async (id: string): Promise<Referral | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referral = mockReferrals.find(ref => ref.id === id);
      resolve(referral || null);
    }, MOCK_DELAY);
  });
};

// Get all referrals for a patient
export const fetchPatientReferrals = async (patientId: string): Promise<Referral[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patientReferrals = mockReferrals.filter(ref => ref.patient.id === patientId);
      resolve(patientReferrals);
    }, MOCK_DELAY);
  });
};

// Get child referrals for a parent referral
export const fetchChildReferrals = async (parentReferralId: string): Promise<Referral[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const childReferrals = mockReferrals.filter(ref => ref.parentReferralId === parentReferralId);
      resolve(childReferrals);
    }, MOCK_DELAY);
  });
};

// Get parent referral for a child referral
export const fetchParentReferral = async (childReferralId: string): Promise<Referral | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const childReferral = mockReferrals.find(ref => ref.id === childReferralId);
      if (childReferral && childReferral.parentReferralId) {
        const parentReferral = mockReferrals.find(ref => ref.id === childReferral.parentReferralId);
        resolve(parentReferral || null);
      } else {
        resolve(null);
      }
    }, MOCK_DELAY);
  });
};

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

// In a real implementation, this would send an HL7 message to the EPR system
export const sendHL7Message = async (referralId: string, action: 'accept' | 'reject'): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`HL7 message sent for referral ${referralId}: ${action.toUpperCase()}`);
      resolve(true);
    }, MOCK_DELAY);
  });
};

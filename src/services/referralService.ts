import { Referral, ReferralStatus } from '@/types/referral';
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

// In a real implementation, this would send an HL7 message to the EPR system
export const sendHL7Message = async (referralId: string, action: 'accept' | 'reject'): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`HL7 message sent for referral ${referralId}: ${action.toUpperCase()}`);
      resolve(true);
    }, MOCK_DELAY);
  });
};

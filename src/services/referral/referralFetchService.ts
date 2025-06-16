
import { Referral } from '@/types/referral';
import { mockReferrals } from '../mockData';

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

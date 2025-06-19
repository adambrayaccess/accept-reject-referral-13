
import { Referral } from '@/types/referral';
import { mockReferrals } from './mock/referrals';

// Re-export all functions from the modular services
export * from './referral/index';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchReferrals = async (): Promise<Referral[]> => {
  await delay(500);
  return mockReferrals;
};

export const fetchReferralById = async (id: string): Promise<Referral | null> => {
  await delay(300);
  console.log('=== fetchReferralById Service ===');
  console.log('Searching for referral ID:', id);
  
  const referral = findReferralById(id);
  
  if (!referral) {
    console.log('❌ Referral not found');
    return null;
  }
  
  console.log('✅ Found referral:', referral.id);
  console.log('Patient data validation:');
  console.log('- Patient ID:', referral.patient.id);
  console.log('- Patient name:', referral.patient.name);
  console.log('- Has reasonableAdjustments:', !!referral.patient.reasonableAdjustments);
  console.log('- reasonableAdjustments value:', referral.patient.reasonableAdjustments);
  console.log('- Has allergies:', !!referral.patient.medicalHistory?.allergies);
  console.log('- Allergies count:', referral.patient.medicalHistory?.allergies?.length || 0);
  console.log('================================');
  
  return referral;
};

export const fetchPatientReferrals = async (patientId: string): Promise<Referral[]> => {
  await delay(200);
  return mockReferrals.filter(referral => referral.patient.id === patientId);
};

export const fetchParentReferral = async (childReferralId: string): Promise<Referral | null> => {
  await delay(200);
  const childReferral = mockReferrals.find(r => r.id === childReferralId);
  if (!childReferral?.parentReferralId) return null;
  
  return mockReferrals.find(r => r.id === childReferral.parentReferralId) || null;
};

export const fetchChildReferrals = async (parentReferralId: string): Promise<Referral[]> => {
  await delay(200);
  return mockReferrals.filter(r => r.parentReferralId === parentReferralId);
};

export const createReferral = async (referralData: Partial<Referral>): Promise<Referral> => {
  await delay(500);
  const newReferral: Referral = {
    id: `REF-${Date.now()}`,
    ubrn: `UBRN${Date.now()}`,
    created: new Date().toISOString(),
    status: 'new',
    priority: 'routine',
    calculatedReferralAge: 0,
    calculatedPatientAge: 0,
    calculatedLocation: 'Unknown',
    ...referralData
  } as Referral;
  
  mockReferrals.push(newReferral);
  return newReferral;
};

// Helper function to find referral by ID
export const findReferralById = (id: string): Referral | undefined => {
  const referral = mockReferrals.find(ref => ref.id === id);
  
  if (referral) {
    console.log('=== findReferralById Debug ===');
    console.log('Found referral:', referral.id);
    console.log('Patient ID:', referral.patient.id);
    console.log('Patient name:', referral.patient.name);
    console.log('Patient reasonableAdjustments:', referral.patient.reasonableAdjustments);
    console.log('Patient allergies:', referral.patient.medicalHistory?.allergies);
    console.log('=============================');
  }
  
  return referral;
};

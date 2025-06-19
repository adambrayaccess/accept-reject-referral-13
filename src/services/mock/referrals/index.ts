
import { Referral } from '@/types/referral';
import { cardiologyReferrals } from './cardiology';
import { dermatologyReferrals } from './dermatology';
import { gastroenterologyReferrals } from './gastroenterology';
import { mentalHealthReferrals } from './mentalhealth';
import { neurologyReferrals } from './neurology';
import { rheumatologyReferrals } from './rheumatology';
import { testReferral003 } from './test-referral-003';

// Combine all referrals
export const mockReferrals: Referral[] = [
  ...cardiologyReferrals,
  ...dermatologyReferrals,
  ...gastroenterologyReferrals,
  ...mentalHealthReferrals,
  ...neurologyReferrals,
  ...rheumatologyReferrals,
  testReferral003
];

// Export individual specialty referrals for easier access
export {
  cardiologyReferrals,
  dermatologyReferrals,
  gastroenterologyReferrals,
  mentalHealthReferrals,
  neurologyReferrals,
  rheumatologyReferrals,
  testReferral003
};

// Helper function to find referral by ID with complete patient data
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

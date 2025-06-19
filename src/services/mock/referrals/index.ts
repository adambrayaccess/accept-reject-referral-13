
import { Referral } from '@/types/referral';
import { cardiologyReferrals } from './cardiology';
import { dermatologyReferrals } from './dermatology';
import { gastroenterologyReferrals } from './gastroenterology';
import { mentalHealthReferrals } from './mentalhealth';
import { neurologyReferrals } from './neurology';
import { rheumatologyReferrals } from './rheumatology';

// Combine all specialty referrals
export const allMockReferrals: Referral[] = [
  ...cardiologyReferrals,
  ...dermatologyReferrals,
  ...gastroenterologyReferrals,
  ...mentalHealthReferrals,
  ...neurologyReferrals,
  ...rheumatologyReferrals
];

// Create alias for backward compatibility
export const mockReferrals = allMockReferrals;

// Export individual arrays for specialty-specific use
export {
  cardiologyReferrals,
  dermatologyReferrals,
  gastroenterologyReferrals,
  mentalHealthReferrals,
  neurologyReferrals,
  rheumatologyReferrals
};

// Export expanded arrays with aliases for backward compatibility
export const allCardiologyReferrals = cardiologyReferrals;
export const allDermatologyReferrals = dermatologyReferrals;
export const allGastroenterologyReferrals = gastroenterologyReferrals;
export const allMentalHealthReferrals = mentalHealthReferrals;
export const allNeurologyReferrals = neurologyReferrals;
export const allRheumatologyReferrals = rheumatologyReferrals;

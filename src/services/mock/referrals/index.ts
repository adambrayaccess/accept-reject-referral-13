
import { cardiologyReferrals as originalCardiologyReferrals, allCardiologyReferrals } from './cardiology';
import { dermatologyReferrals as originalDermatologyReferrals, allDermatologyReferrals } from './dermatology';
import { neurologyReferrals as originalNeurologyReferrals, allNeurologyReferrals } from './neurology';
import { rheumatologyReferrals as originalRheumatologyReferrals, allRheumatologyReferrals } from './rheumatology';
import { gastroenterologyReferrals as originalGastroenterologyReferrals, allGastroenterologyReferrals } from './gastroenterology';
import { mentalHealthReferrals as originalMentalHealthReferrals, allMentalHealthReferrals } from './mentalhealth';
import { Referral } from '@/types/referral';

// Export the original referrals to maintain backward compatibility
export const cardiologyReferrals = originalCardiologyReferrals;
export const dermatologyReferrals = originalDermatologyReferrals;
export const neurologyReferrals = originalNeurologyReferrals;
export const rheumatologyReferrals = originalRheumatologyReferrals;
export const gastroenterologyReferrals = originalGastroenterologyReferrals;
export const mentalHealthReferrals = originalMentalHealthReferrals;

// Combine all specialty referrals from the full sets (50 per specialty)
export const mockReferrals: Referral[] = [
  ...allCardiologyReferrals,
  ...allDermatologyReferrals,
  ...allNeurologyReferrals,
  ...allRheumatologyReferrals,
  ...allGastroenterologyReferrals,
  ...allMentalHealthReferrals
];

// Export the full sets as well for when more data is needed
export {
  allCardiologyReferrals,
  allDermatologyReferrals,
  allNeurologyReferrals,
  allRheumatologyReferrals,
  allGastroenterologyReferrals,
  allMentalHealthReferrals
};

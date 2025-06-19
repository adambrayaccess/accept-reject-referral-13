
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

// Export individual arrays for specialty-specific use
export {
  cardiologyReferrals,
  dermatologyReferrals,
  gastroenterologyReferrals,
  mentalHealthReferrals,
  neurologyReferrals,
  rheumatologyReferrals
};

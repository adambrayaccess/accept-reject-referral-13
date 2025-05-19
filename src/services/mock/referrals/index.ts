
import { cardiologyReferrals } from './cardiology';
import { dermatologyReferrals } from './dermatology';
import { neurologyReferrals } from './neurology';
import { rheumatologyReferrals } from './rheumatology';
import { gastroenterologyReferrals } from './gastroenterology';
import { mentalHealthReferrals } from './mentalhealth';
import { Referral } from '@/types/referral';

// Combine all specialty referrals
export const mockReferrals: Referral[] = [
  ...cardiologyReferrals,
  ...dermatologyReferrals,
  ...neurologyReferrals,
  ...rheumatologyReferrals,
  ...gastroenterologyReferrals,
  ...mentalHealthReferrals
];

// Export individual specialty referrals for more granular access
export {
  cardiologyReferrals,
  dermatologyReferrals,
  neurologyReferrals,
  rheumatologyReferrals,
  gastroenterologyReferrals,
  mentalHealthReferrals
};

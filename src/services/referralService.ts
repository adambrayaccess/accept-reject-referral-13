// Updated referral service that uses Supabase instead of mock data
export { referralService as fetchReferrals, referralService as fetchReferralById, referralService as fetchPatientReferrals } from './supabase/referralService'

// Keep the existing update functions for backward compatibility
export { 
  updateReferralStatus,
  updateTriageStatus,
  updateReferralTags,
  setReferralsData 
} from './referral/referralUpdateService'

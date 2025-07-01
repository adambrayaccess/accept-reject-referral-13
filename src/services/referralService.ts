
// Main export file for all referral services
export * from './referral';

export { 
  updateReferralStatus,
  updateTriageStatus,
  updateReferralTags,
  setReferralsData 
} from './referral/referralUpdateService';

// Re-export fetch services that now use Supabase exclusively
export {
  fetchReferrals,
  fetchReferralById,
  fetchPatientReferrals,
  fetchChildReferrals,
  fetchParentReferral
} from './referral/referralFetchService';

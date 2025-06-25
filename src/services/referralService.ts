
// Updated referral service that uses Supabase instead of mock data
export { referralService as fetchReferrals, referralService as fetchReferralById, referralService as fetchPatientReferrals } from './supabase/referralService'

// Keep the existing update functions for backward compatibility
export { 
  updateReferralStatus,
  updateTriageStatus,
  updateReferralTags,
  setReferralsData 
} from './referral/referralUpdateService'

// Export additional functions for backward compatibility
export const sendHL7Message = async (referralId: string, messageType: string) => {
  // This is a placeholder for HL7 messaging functionality
  console.log(`Sending HL7 message for referral ${referralId} of type ${messageType}`);
  return { success: true };
};

export const createSubReferral = async (parentId: string, subReferralData: any) => {
  // This is a placeholder for sub-referral creation
  console.log(`Creating sub-referral for parent ${parentId}`);
  return { success: true };
};

export const fetchParentReferral = async (referralId: string) => {
  const { referralService } = await import('./supabase/referralService');
  return referralService.getById(referralId);
};

export const fetchChildReferrals = async (parentId: string) => {
  // This is a placeholder - we'd need to add this to the Supabase service
  return [];
};

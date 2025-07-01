
// Re-export all fetch functions from their respective modules
export { fetchReferralById } from './singleReferralService';
export { fetchReferrals } from './bulkReferralService';
export { fetchPatientReferrals } from './patientReferralService';
export { fetchChildReferrals, fetchParentReferral } from './hierarchicalReferralService';
export { mapPatient, mapPractitioner, mapReferralData } from './referralMappers';

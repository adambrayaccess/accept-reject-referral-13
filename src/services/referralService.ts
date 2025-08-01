
// Main export file for all referral services
export * from './referral';

export { 
  updateReferralStatus,
  updateTriageStatus,
  updateReferralTags,
  updateReferralDetails,
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

// Export FHIR services
export {
  FhirResourceService,
  FhirPatientService,
  FhirServiceRequestService,
  FhirPractitionerService,
  FhirSyncService
} from './fhir';

// Export Pathway services
export {
  fetchRTTPathway,
  createOrUpdateRTTPathway,
  updateRTTPathwayStatus,
  addRTTPathwayPause,
  fetchCarePathway,
  createCarePathway,
  updateCarePathwayStatus
} from './pathwayService';

export { FhirIntegrationService } from './referral/fhirIntegrationService';

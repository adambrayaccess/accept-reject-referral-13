
import { Referral, Patient, FhirPractitioner } from '@/types/referral';
import { FhirIntegrationService } from './fhirIntegrationService';

export const mapPatient = (patient: any): Patient => ({
  id: patient.id,
  name: patient.name,
  birthDate: patient.birth_date,
  gender: patient.gender,
  nhsNumber: patient.nhs_number,
  address: patient.address,
  phone: patient.phone,
  // Add FHIR-related fields
  fhirId: patient.fhir_id,
  active: patient.active,
  maritalStatus: patient.marital_status_display,
  ethnicity: patient.ethnicity,
  pronouns: patient.pronouns,
  accommodationType: patient.accommodation_type,
  // Access restriction info
  accessRestriction: patient.access_restriction_enabled ? {
    isRestricted: patient.access_restriction_enabled,
    level: patient.access_restriction_level,
    reason: patient.access_restriction_reason,
    appliedBy: patient.access_restriction_applied_by,
    appliedDate: patient.access_restriction_applied_date,
    reviewDate: patient.access_restriction_review_date,
    notes: patient.access_restriction_notes
  } : undefined
});

export const mapPractitioner = (practitioner: any): FhirPractitioner => ({
  id: practitioner.id,
  name: practitioner.name,
  role: practitioner.role,
  organization: practitioner.organization,
  contact: practitioner.contact,
  // Add FHIR-related fields
  fhirId: practitioner.fhir_id,
  active: practitioner.active,
  gender: practitioner.gender,
  birthDate: practitioner.birth_date
});

export const mapReferralData = (referral: any): Referral => {
  const mappedReferral: Referral = {
    id: referral.id,
    ubrn: referral.ubrn,
    created: referral.created_at,
    status: referral.status,
    priority: referral.priority,
    patient: mapPatient(referral.patient),
    referrer: mapPractitioner(referral.referrer),
    specialty: referral.specialty,
    service: referral.service,
    clinicalInfo: {
      reason: referral.reason,
      history: referral.history,
      diagnosis: referral.diagnosis,
      medications: referral.medications ? referral.medications.split(',') : [],
      allergies: referral.allergies_info ? referral.allergies_info.split(',') : [],
      notes: referral.notes
    },
    attachments: [],
    triageStatus: referral.triage_status,
    parentReferralId: referral.parent_referral_id,
    isSubReferral: referral.is_sub_referral,
    aiGenerated: referral.ai_generated,
    confidence: referral.confidence,
    teamId: referral.team_id,
    assignedHCPId: referral.assigned_hcp_id,
    allocatedDate: referral.allocated_date,
    allocatedBy: referral.allocated_by,
    // Add FHIR-related fields
    fhirId: referral.fhir_id,
    intent: referral.intent,
    authoredOn: referral.authored_on,
    supportingInfo: referral.supporting_info
  };

  // Automatically sync to FHIR when mapping (for real-time sync)
  // This ensures FHIR resources are always up-to-date
  FhirIntegrationService.handleReferralChange(mappedReferral).catch(error => {
    console.error('Background FHIR sync failed:', error);
  });

  return mappedReferral;
};

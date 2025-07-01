
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
  // Medical history
  medicalHistory: patient.medical_history,
  // GP details
  gpDetails: patient.gp_details ? {
    id: patient.gp_details.id,
    name: patient.gp_details.name,
    practice: patient.gp_details.practice,
    address: patient.gp_details.address,
    phone: patient.gp_details.phone,
    email: patient.gp_details.email
  } : undefined,
  // Related people
  relatedPeople: patient.related_people?.map((person: any) => ({
    id: person.id,
    name: person.name,
    relationship: person.relationship,
    phone: person.phone,
    email: person.email,
    address: person.address,
    isPrimaryContact: person.is_primary_contact,
    isNextOfKin: person.is_next_of_kin,
    isEmergencyContact: person.is_emergency_contact
  })),
  // Pharmacies
  pharmacies: patient.pharmacies?.map((pharmacy: any) => ({
    id: pharmacy.id,
    name: pharmacy.name,
    address: pharmacy.address,
    phone: pharmacy.phone,
    email: pharmacy.email,
    type: pharmacy.pharmacy_type
  })),
  // Reasonable adjustments
  reasonableAdjustments: patient.reasonable_adjustments ? {
    hasAdjustments: patient.reasonable_adjustments.has_adjustments,
    flagLevel: patient.reasonable_adjustments.flag_level,
    lastUpdated: patient.reasonable_adjustments.last_updated,
    updatedBy: patient.reasonable_adjustments.updated_by
  } : undefined,
  // Access restriction
  accessRestriction: patient.access_restriction_enabled ? {
    isRestricted: patient.access_restriction_enabled,
    level: patient.access_restriction_level,
    reason: patient.access_restriction_reason,
    appliedBy: patient.access_restriction_applied_by,
    appliedDate: patient.access_restriction_applied_date,
    reviewDate: patient.access_restriction_review_date,
    notes: patient.access_restriction_notes
  } : undefined,
  // Historic addresses
  historicAddresses: patient.historic_addresses?.map((address: any) => ({
    id: address.id,
    address: address.address,
    dateFrom: address.date_from,
    dateTo: address.date_to,
    type: address.address_type
  }))
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
    attachments: referral.attachments || [],
    auditLog: referral.audit_log?.map((log: any) => ({
      timestamp: log.timestamp,
      action: log.action,
      user: log.user_name,
      notes: log.notes
    })),
    collaborationNotes: referral.collaboration_notes?.map((note: any) => ({
      id: note.id,
      timestamp: note.timestamp,
      author: note.author,
      content: note.content,
      isInternal: note.is_internal
    })),
    triageStatus: referral.triage_status,
    tags: referral.tags?.map((tag: any) => tag.tag),
    parentReferralId: referral.parent_referral_id,
    childReferralIds: referral.child_referral_ids,
    isSubReferral: referral.is_sub_referral,
    aiGenerated: referral.ai_generated,
    confidence: referral.confidence,
    appointmentDetails: referral.appointment_details,
    rttPathway: referral.rtt_pathway,
    carePathway: referral.care_pathway,
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


import { Referral, Patient, Practitioner } from '@/types/referral';

export const mapPatient = (patient: any): Patient => ({
  id: patient.id,
  name: patient.name,
  birthDate: patient.birth_date,
  gender: patient.gender,
  nhsNumber: patient.nhs_number,
  address: patient.address,
  phone: patient.phone
});

export const mapPractitioner = (practitioner: any): Practitioner => ({
  id: practitioner.id,
  name: practitioner.name,
  role: practitioner.role,
  organization: practitioner.organization,
  contact: practitioner.contact
});

export const mapReferralData = (referral: any): Referral => ({
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
  allocatedBy: referral.allocated_by
});

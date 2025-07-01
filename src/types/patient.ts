
import type { MedicalHistory } from './medical';
import type { ReasonableAdjustmentsFlag } from './reasonable-adjustments';

export interface GPDetails {
  id: string;
  name: string;
  practice: string;
  address: string;
  phone: string;
  email?: string;
}

export interface PharmacyDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  type: 'nominated' | 'linked';
}

export interface RelatedPerson {
  id: string;
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  address?: string;
  isPrimaryContact: boolean;
  isNextOfKin: boolean;
  isEmergencyContact: boolean;
}

export interface HistoricAddress {
  id: string;
  address: string;
  dateFrom: string;
  dateTo?: string;
  type: 'residential' | 'temporary' | 'correspondence';
}

export interface AccessRestriction {
  isRestricted: boolean;
  level?: string;
  reason?: string;
  appliedBy?: string;
  appliedDate?: string;
  reviewDate?: string;
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  gender?: string;
  nhsNumber: string;
  address?: string;
  phone?: string;
  // FHIR-related fields
  fhirId?: string;
  active?: boolean;
  maritalStatus?: string;
  ethnicity?: string;
  pronouns?: string;
  accommodationType?: string;
  // Medical history
  medicalHistory?: MedicalHistory;
  // GP details
  gpDetails?: GPDetails;
  // Related people
  relatedPeople?: RelatedPerson[];
  // Pharmacies
  pharmacies?: PharmacyDetails[];
  // Reasonable adjustments
  reasonableAdjustments?: ReasonableAdjustmentsFlag;
  // Access restriction
  accessRestriction?: AccessRestriction;
  // Historic addresses
  historicAddresses?: HistoricAddress[];
}

export interface HealthcareProfessional {
  id: string;
  name: string;
  role: string;
  specialty: string;
  teamIds?: string[]; // NEW - Teams this HCP belongs to
  isTeamLead?: boolean; // NEW - Whether this HCP leads any teams
}

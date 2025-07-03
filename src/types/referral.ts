
// Import all the types from the modular files
export * from './patient';
export * from './medical';
export * from './pathway';
export * from './workflow';
export * from './common';

// Import specific types for the main Referral interface
import type { Patient } from './patient';
import type { RTTPathway, CarePathway } from './pathway';
import type { 
  ReferralStatus, 
  ReferralPriority, 
  TriageStatus, 
  AuditLogEntry, 
  CollaborationNote, 
  Attachment, 
  ClinicalInfo, 
  AppointmentDetails 
} from './workflow';

export interface Referral {
  id: string;
  ubrn: string;
  created: string;
  status: ReferralStatus;
  priority: ReferralPriority;
  patient: Patient;
  referrer: FhirPractitioner;
  specialty: string;
  service?: string;
  clinicalInfo: ClinicalInfo;
  attachments: Attachment[];
  auditLog?: AuditLogEntry[];
  collaborationNotes?: CollaborationNote[];
  triageStatus?: TriageStatus;
  tags?: string[];
  // Parent-child relationship fields
  parentReferralId?: string;
  childReferralIds?: string[];
  isSubReferral?: boolean;
  // Calculated fields (for filtering)
  calculatedReferralAge?: number;
  calculatedPatientAge?: number;
  calculatedLocation?: string;
  // AI-generated referral indicator
  aiGenerated?: boolean;
  confidence?: number;
  // Appointment details
  appointmentDetails?: AppointmentDetails;
  // RTT Pathway information
  rttPathway?: RTTPathway;
  // Care Pathway information
  carePathway?: CarePathway;
  // Team allocation
  teamId?: string;
  assignedHCPId?: string;
  allocatedDate?: string;
  allocatedBy?: string;
  // FHIR-related fields
  fhirId?: string;
  intent?: string;
  authoredOn?: string;
  supportingInfo?: string[];
  // Display order for manual sorting
  displayOrder?: number;
  // Administrative category
  administrativeCategory?: string;
  // Overseas status
  overseasStatus?: string;
  // Referral type
  referralType?: string;
  // Patient area/care setting
  patientAreaCareSetting?: string;
}

// FHIR-compliant Practitioner interface
export interface FhirPractitioner {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  contact?: string;
  // FHIR-related fields
  fhirId?: string;
  active?: boolean;
  gender?: string;
  birthDate?: string;
}

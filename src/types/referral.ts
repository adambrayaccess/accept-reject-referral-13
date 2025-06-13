
export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  nhsNumber: string;
  address?: string;
  phone?: string;
  medicalHistory?: MedicalHistory;
}

export interface Practitioner {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  contact?: string;
}

export interface Attachment {
  id: string;
  title: string;
  contentType: string;
  url: string;
  date: string;
  size?: number;
}

export interface ClinicalInfo {
  reason: string;
  history?: string;
  diagnosis?: string;
  medications?: string[];
  allergies?: string[];
  notes?: string;
}

export type ReferralStatus = 'new' | 'accepted' | 'rejected' | 'forwarded';
export type ReferralPriority = 'routine' | 'urgent' | 'emergency';
export type TriageStatus = 'pre-assessment' | 'assessed' | 'pre-admission-assessment' | 'waiting-list' | 'refer-to-another-specialty';

export interface AuditLogEntry {
  timestamp: string;
  user: string;
  action: string;
  notes?: string;
}

export interface CollaborationNote {
  timestamp: string;
  author: string;
  content: string;
}

export interface ForwardingInfo {
  originalReferrer: Practitioner;
  originalSpecialty: string;
  forwardedBy: string;
  forwardedAt: string;
  forwardingNotes?: string;
}

export interface Referral {
  id: string;
  ubrn: string;
  created: string;
  status: ReferralStatus;
  priority: ReferralPriority;
  patient: Patient;
  referrer: Practitioner;
  specialty: string;
  service?: string;
  clinicalInfo: ClinicalInfo;
  attachments: Attachment[];
  auditLog?: AuditLogEntry[];
  collaborationNotes?: CollaborationNote[];
  triageStatus?: TriageStatus;
  tags?: string[];
  forwardingInfo?: ForwardingInfo;
  // Calculated fields (for filtering)
  calculatedReferralAge?: number;
  calculatedPatientAge?: number;
  calculatedLocation?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export interface VitalSign {
  timestamp: string;
  news2: number;
  temperature: number;
  heartRate: number;
  respiration: number;
  oxygenSaturation: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
}

export interface CardiogramDataPoint {
  time: number;
  value: number;
}

export interface Cardiogram {
  timestamp: string;
  data: CardiogramDataPoint[];
  interpretation: string;
}

export interface MedicalHistory {
  vitalSigns: VitalSign[];
  cardiograms?: Cardiogram[];
}

export interface SpecialtyOption {
  id: string;
  name: string;
}

export interface HealthcareProfessional {
  id: string;
  name: string;
  role: string;
  specialty: string;
}

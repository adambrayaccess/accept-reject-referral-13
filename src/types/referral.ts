
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

export interface AppointmentDetails {
  id: string;
  date: string;
  time: string;
  type: 'consultation' | 'pre-admission' | 'follow-up' | 'procedure';
  location: string;
  consultant?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

// New RTT Pathway related types
export type RTTPathwayStatus = 'incomplete' | 'completed' | 'stopped' | 'paused';
export type RTTBreachRisk = 'low' | 'medium' | 'high' | 'breached';

export interface RTTPathway {
  clockStart: string; // ISO date string when RTT clock started
  targetDate: string; // ISO date string for 18-week target
  status: RTTPathwayStatus;
  daysRemaining: number; // Calculated field
  breachRisk: RTTBreachRisk; // Calculated field based on days remaining
  pauseHistory?: Array<{
    startDate: string;
    endDate?: string;
    reason: string;
  }>;
}

// New Care Pathway related types
export type CarePathwayType = 
  | 'cancer-two-week-wait'
  | 'urgent-suspected-cancer'
  | 'elective-surgery'
  | 'emergency-pathway'
  | 'chronic-disease-management'
  | 'diagnostic-pathway'
  | 'mental-health-pathway'
  | 'paediatric-pathway'
  | 'maternity-pathway'
  | 'rehabilitation-pathway'
  | 'end-of-life-care'
  | 'screening-programme';

export interface CarePathway {
  type: CarePathwayType;
  name: string;
  description?: string;
  priority: 'routine' | 'urgent' | 'emergency';
  targetTimeframe?: string; // e.g., "14 days", "6 weeks"
  status: 'active' | 'completed' | 'paused' | 'discontinued';
}

export type ReferralStatus = 'new' | 'accepted' | 'rejected';
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
  // Team allocation - NEW
  teamId?: string;
  assignedHCPId?: string; // Individual HCP within the team
  allocatedDate?: string;
  allocatedBy?: string;
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

export interface MedicationPrescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  prescribedBy: string;
  indication: string;
  status: 'active' | 'discontinued' | 'completed';
  notes?: string;
  endDate?: string;
}

export interface MedicalHistory {
  vitalSigns: VitalSign[];
  cardiograms?: Cardiogram[];
  medicationHistory?: MedicationPrescription[];
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
  teamIds?: string[]; // NEW - Teams this HCP belongs to
  isTeamLead?: boolean; // NEW - Whether this HCP leads any teams
}

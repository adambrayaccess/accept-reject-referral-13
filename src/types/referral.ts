
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

export type ReferralStatus = 'new' | 'accepted' | 'rejected';
export type ReferralPriority = 'routine' | 'urgent' | 'emergency';

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
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

// New interfaces for medical history data
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

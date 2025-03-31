
export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  nhsNumber: string;
  address?: string;
  phone?: string;
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

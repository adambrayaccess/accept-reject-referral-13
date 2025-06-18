
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

export interface SpecialtyOption {
  id: string;
  name: string;
}

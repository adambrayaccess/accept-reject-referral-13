
export type ReferralStatus = 'new' | 'triaged' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type ReferralPriority = 'routine' | 'urgent' | 'emergency';
export type TriageStatus = 'pending' | 'in_progress' | 'completed';

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  user: string;
  notes?: string;
}

export interface CollaborationNote {
  id: string;
  timestamp: string;
  author: string;
  content: string;
  isInternal: boolean;
}

export interface Attachment {
  id: string;
  title: string;
  contentType: string;
  size: number;
  date: string;
  url?: string;
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
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  status: string;
  location: string;
  consultant: string;
  notes?: string;
}


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

export interface HealthcareProfessional {
  id: string;
  name: string;
  role: string;
  specialty: string;
  teamIds?: string[]; // NEW - Teams this HCP belongs to
  isTeamLead?: boolean; // NEW - Whether this HCP leads any teams
}

// Re-export medical history from medical types
export type { MedicalHistory } from './medical';

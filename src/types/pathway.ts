
// RTT Pathway related types
export type RTTPathwayStatus = 'active' | 'paused' | 'completed' | 'discontinued';
export type RTTBreachRisk = 'low' | 'medium' | 'high' | 'breached';

export interface RTTPauseHistory {
  startDate: string;
  endDate?: string;
  reason: string;
  pausedBy: string;
}

export interface RTTPathway {
  id?: string;
  referralId?: string;
  clockStart: string; // ISO date string when RTT clock started
  targetDate: string; // ISO date string for 18-week target
  status: RTTPathwayStatus;
  daysRemaining: number; // Calculated field
  breachRisk: RTTBreachRisk; // Calculated field based on days remaining
  pauseHistory?: RTTPauseHistory[];
  createdAt?: string;
  updatedAt?: string;
}

// Care Pathway related types
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

export type CarePathwayStatus = 'active' | 'completed' | 'cancelled' | 'on-hold';
export type CarePathwayPriority = 'low' | 'standard' | 'high' | 'urgent';

export interface CarePathway {
  id?: string;
  referralId?: string;
  type?: CarePathwayType;
  name: string;
  description?: string;
  priority?: 'routine' | 'urgent' | 'emergency';
  priorityLevel?: CarePathwayPriority;
  targetTimeframe?: string; // e.g., "14 days", "6 weeks"
  status: CarePathwayStatus;
  createdAt?: string;
  updatedAt?: string;
}


// RTT Pathway related types
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

export interface CarePathway {
  type: CarePathwayType;
  name: string;
  description?: string;
  priority: 'routine' | 'urgent' | 'emergency';
  targetTimeframe?: string; // e.g., "14 days", "6 weeks"
  status: 'active' | 'completed' | 'paused' | 'discontinued';
}


export interface ReasonableAdjustment {
  id: string;
  category: 'communication' | 'mobility' | 'sensory' | 'cognitive' | 'mental-health' | 'other';
  description: string;
  specificNeeds: string;
  implementationNotes?: string;
  dateRecorded: string;
  recordedBy: string;
  reviewDate?: string;
  status: 'active' | 'inactive' | 'under-review';
}

export interface ReasonableAdjustmentsFlag {
  hasAdjustments: boolean;
  flagLevel: 'none' | 'standard' | 'complex';
  adjustments: ReasonableAdjustment[];
  lastUpdated: string;
  updatedBy: string;
}

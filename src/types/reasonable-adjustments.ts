
export interface ReasonableAdjustment {
  id: string;
  category: string;
  description: string;
  specificNeeds?: string;
  implementationNotes?: string;
  status: 'active' | 'inactive' | 'completed';
  dateRecorded?: string;
  recordedBy?: string;
  reviewDate?: string;
}

export interface ReasonableAdjustmentsFlag {
  hasAdjustments: boolean;
  flagLevel?: 'none' | 'low' | 'medium' | 'high' | 'standard' | 'complex';
  lastUpdated?: string;
  updatedBy?: string;
  adjustments: ReasonableAdjustment[];
}

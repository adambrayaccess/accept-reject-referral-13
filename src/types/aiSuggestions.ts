
export interface AISuggestion {
  id: string;
  type: 'triage-status' | 'appointment' | 'waiting-list' | 'tagging' | 'follow-up';
  title: string;
  description: string;
  confidence: number; // 0-1
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  metadata?: Record<string, any>;
}

export interface TriageStatusSuggestion extends AISuggestion {
  type: 'triage-status';
  suggestedStatus: 'pre-assessment' | 'assessed' | 'pre-admission-assessment' | 'waiting-list' | 'refer-to-another-specialty';
  estimatedTimeframe?: string;
}

export interface AppointmentSuggestion extends AISuggestion {
  type: 'appointment';
  urgency: 'routine' | 'urgent' | 'emergency';
  suggestedTimeframe: string;
  appointmentType?: string;
}

export interface WaitingListSuggestion extends AISuggestion {
  type: 'waiting-list';
  suggestedPosition: 'priority' | 'standard' | 'low-priority';
  estimatedWaitTime?: string;
}

export interface TaggingSuggestion extends AISuggestion {
  type: 'tagging';
  suggestedTags: string[];
  categories: string[];
}

export interface FollowUpSuggestion extends AISuggestion {
  type: 'follow-up';
  followUpType: 'test-results' | 'specialist-review' | 'patient-contact' | 'documentation';
  timeline: string;
}

export type SpecificAISuggestion = 
  | TriageStatusSuggestion 
  | AppointmentSuggestion 
  | WaitingListSuggestion 
  | TaggingSuggestion 
  | FollowUpSuggestion;

export interface AISuggestionsResponse {
  suggestions: SpecificAISuggestion[];
  generatedAt: string;
  processingTime: number;
  confidence: number;
}

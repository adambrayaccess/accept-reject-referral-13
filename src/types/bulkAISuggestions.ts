
import { Referral } from './referral';

export interface BulkAISuggestion {
  id: string;
  type: 'batch-tagging' | 'priority-rebalancing' | 'appointment-scheduling' | 'report-generation' | 'workflow-optimization';
  title: string;
  description: string;
  confidence: number; // 0-1
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  affectedReferralsCount: number;
  metadata?: Record<string, any>;
}

export interface BatchTaggingSuggestion extends BulkAISuggestion {
  type: 'batch-tagging';
  suggestedTags: string[];
  categories: string[];
  tagReason: string;
}

export interface PriorityRebalancingSuggestion extends BulkAISuggestion {
  type: 'priority-rebalancing';
  rebalanceActions: Array<{
    referralId: string;
    currentPriority: string;
    suggestedPriority: string;
    reason: string;
  }>;
}

export interface AppointmentSchedulingSuggestion extends BulkAISuggestion {
  type: 'appointment-scheduling';
  schedulingStrategy: 'urgent-first' | 'geographic-grouping' | 'specialty-batching';
  estimatedTimeframe: string;
  appointmentType?: string;
}

export interface ReportGenerationSuggestion extends BulkAISuggestion {
  type: 'report-generation';
  reportType: 'waiting-times' | 'patient-demographics' | 'clinical-patterns' | 'resource-utilization';
  reportFormat: 'pdf' | 'excel' | 'dashboard';
}

export interface WorkflowOptimizationSuggestion extends BulkAISuggestion {
  type: 'workflow-optimization';
  optimizationType: 'triage-efficiency' | 'resource-allocation' | 'pathway-streamlining';
  estimatedImpact: string;
}

export type SpecificBulkAISuggestion = 
  | BatchTaggingSuggestion 
  | PriorityRebalancingSuggestion 
  | AppointmentSchedulingSuggestion 
  | ReportGenerationSuggestion 
  | WorkflowOptimizationSuggestion;

export interface BulkAISuggestionsResponse {
  suggestions: SpecificBulkAISuggestion[];
  generatedAt: string;
  processingTime: number;
  confidence: number;
  selectedReferralsCount: number;
}

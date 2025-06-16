
import { Referral } from '@/types/referral';
import { AISuggestionsResponse, SpecificAISuggestion, TriageStatusSuggestion, AppointmentSuggestion, WaitingListSuggestion, TaggingSuggestion, FollowUpSuggestion } from '@/types/aiSuggestions';

const MOCK_DELAY = 1500; // Simulate AI processing time

// Clinical patterns and rules for AI suggestions
const CLINICAL_PATTERNS = {
  urgent_indicators: ['chest pain', 'shortness of breath', 'severe headache', 'stroke', 'heart attack'],
  routine_indicators: ['follow-up', 'routine check', 'monitoring'],
  complex_case_indicators: ['multiple conditions', 'comorbidities', 'previous surgery'],
  priority_specialties: ['cardiology', 'neurology', 'emergency'],
};

export const generateAISuggestions = async (referral: Referral): Promise<AISuggestionsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startTime = Date.now();
      const suggestions = analyzeReferralAndGenerateSuggestions(referral);
      const processingTime = Date.now() - startTime;

      resolve({
        suggestions,
        generatedAt: new Date().toISOString(),
        processingTime,
        confidence: calculateOverallConfidence(suggestions)
      });
    }, MOCK_DELAY);
  });
};

const analyzeReferralAndGenerateSuggestions = (referral: Referral): SpecificAISuggestion[] => {
  const suggestions: SpecificAISuggestion[] = [];

  // Generate triage status suggestion
  suggestions.push(generateTriageStatusSuggestion(referral));

  // Generate appointment suggestion
  suggestions.push(generateAppointmentSuggestion(referral));

  // Generate waiting list suggestion if applicable
  if (referral.status === 'accepted') {
    suggestions.push(generateWaitingListSuggestion(referral));
  }

  // Generate tagging suggestions
  suggestions.push(generateTaggingSuggestion(referral));

  // Generate follow-up suggestions
  suggestions.push(...generateFollowUpSuggestions(referral));

  return suggestions.sort((a, b) => b.confidence - a.confidence);
};

const generateTriageStatusSuggestion = (referral: Referral): TriageStatusSuggestion => {
  const clinicalInfo = referral.clinicalInfo.reason.toLowerCase();
  const currentStatus = referral.triageStatus;

  let suggestedStatus: TriageStatusSuggestion['suggestedStatus'] = 'pre-assessment';
  let confidence = 0.7;
  let reasoning = 'Based on clinical information analysis';

  // Analyze urgency and complexity
  if (CLINICAL_PATTERNS.urgent_indicators.some(indicator => clinicalInfo.includes(indicator))) {
    suggestedStatus = 'pre-admission-assessment';
    confidence = 0.9;
    reasoning = 'Urgent clinical indicators detected requiring immediate pre-admission assessment';
  } else if (referral.priority === 'urgent') {
    suggestedStatus = 'assessed';
    confidence = 0.85;
    reasoning = 'Urgent priority referral should be assessed promptly';
  } else if (currentStatus === 'pre-assessment') {
    suggestedStatus = 'assessed';
    confidence = 0.8;
    reasoning = 'Ready to progress from pre-assessment to assessed status';
  }

  return {
    id: `triage-${Date.now()}`,
    type: 'triage-status',
    title: `Recommend ${suggestedStatus.replace('-', ' ')} status`,
    description: `AI suggests updating triage status to ${suggestedStatus.replace('-', ' ')}`,
    confidence,
    reasoning,
    priority: confidence > 0.8 ? 'high' : 'medium',
    actionable: true,
    suggestedStatus,
    estimatedTimeframe: suggestedStatus === 'pre-admission-assessment' ? '24-48 hours' : '1-2 weeks'
  };
};

const generateAppointmentSuggestion = (referral: Referral): AppointmentSuggestion => {
  const clinicalInfo = referral.clinicalInfo.reason.toLowerCase();
  let urgency: AppointmentSuggestion['urgency'] = 'routine';
  let confidence = 0.7;
  let timeframe = '4-6 weeks';

  if (CLINICAL_PATTERNS.urgent_indicators.some(indicator => clinicalInfo.includes(indicator))) {
    urgency = 'urgent';
    timeframe = '1-2 weeks';
    confidence = 0.9;
  } else if (referral.priority === 'urgent') {
    urgency = 'urgent';
    timeframe = '2-3 weeks';
    confidence = 0.85;
  }

  return {
    id: `appointment-${Date.now()}`,
    type: 'appointment',
    title: `Schedule ${urgency} appointment`,
    description: `Recommend scheduling ${urgency} appointment within ${timeframe}`,
    confidence,
    reasoning: `Based on clinical priority and referral urgency level`,
    priority: urgency === 'urgent' ? 'high' : 'medium',
    actionable: true,
    urgency,
    suggestedTimeframe: timeframe,
    appointmentType: referral.specialty
  };
};

const generateWaitingListSuggestion = (referral: Referral): WaitingListSuggestion => {
  let position: WaitingListSuggestion['suggestedPosition'] = 'standard';
  let confidence = 0.75;
  let waitTime = '6-8 weeks';

  if (referral.priority === 'urgent') {
    position = 'priority';
    waitTime = '2-4 weeks';
    confidence = 0.9;
  } else if (referral.priority === 'routine') {
    position = 'standard';
    waitTime = '8-12 weeks';
    confidence = 0.8;
  }

  return {
    id: `waiting-list-${Date.now()}`,
    type: 'waiting-list',
    title: `Place on ${position} waiting list`,
    description: `Recommend ${position} positioning with estimated wait time of ${waitTime}`,
    confidence,
    reasoning: `Based on referral priority and current service capacity`,
    priority: position === 'priority' ? 'high' : 'medium',
    actionable: true,
    suggestedPosition: position,
    estimatedWaitTime: waitTime
  };
};

const generateTaggingSuggestion = (referral: Referral): TaggingSuggestion => {
  const clinicalInfo = referral.clinicalInfo.reason.toLowerCase();
  const existingTags = referral.tags || [];
  const suggestedTags: string[] = [];
  const categories: string[] = [];

  // Analyze clinical content for tag suggestions
  if (CLINICAL_PATTERNS.urgent_indicators.some(indicator => clinicalInfo.includes(indicator))) {
    suggestedTags.push('Urgent review');
    categories.push('priority');
  }

  if (CLINICAL_PATTERNS.complex_case_indicators.some(indicator => clinicalInfo.includes(indicator))) {
    suggestedTags.push('Complex case');
    categories.push('clinical');
  }

  if (referral.clinicalInfo.medications && referral.clinicalInfo.medications.length > 3) {
    suggestedTags.push('Multiple medications');
    categories.push('clinical');
  }

  if (!suggestedTags.length) {
    suggestedTags.push('Routine follow-up');
    categories.push('status');
  }

  // Filter out existing tags
  const newTags = suggestedTags.filter(tag => !existingTags.includes(tag));

  return {
    id: `tagging-${Date.now()}`,
    type: 'tagging',
    title: `Add clinical tags`,
    description: `Recommend adding ${newTags.length} relevant clinical tags`,
    confidence: 0.8,
    reasoning: `Based on clinical content analysis and case characteristics`,
    priority: 'medium',
    actionable: newTags.length > 0,
    suggestedTags: newTags,
    categories
  };
};

const generateFollowUpSuggestions = (referral: Referral): FollowUpSuggestion[] => {
  const suggestions: FollowUpSuggestion[] = [];

  // Test results follow-up
  if (referral.clinicalInfo.reason.toLowerCase().includes('test') || 
      referral.clinicalInfo.reason.toLowerCase().includes('investigation')) {
    suggestions.push({
      id: `followup-tests-${Date.now()}`,
      type: 'follow-up',
      title: 'Schedule test results review',
      description: 'Ensure test results are reviewed and actioned appropriately',
      confidence: 0.85,
      reasoning: 'Clinical information indicates pending test results',
      priority: 'medium',
      actionable: true,
      followUpType: 'test-results',
      timeline: '1-2 weeks'
    });
  }

  // Documentation follow-up
  if (!referral.clinicalInfo.diagnosis) {
    suggestions.push({
      id: `followup-docs-${Date.now()}`,
      type: 'follow-up',
      title: 'Complete clinical documentation',
      description: 'Missing provisional diagnosis - request additional clinical information',
      confidence: 0.9,
      reasoning: 'Incomplete clinical documentation detected',
      priority: 'high',
      actionable: true,
      followUpType: 'documentation',
      timeline: '3-5 days'
    });
  }

  return suggestions;
};

const calculateOverallConfidence = (suggestions: SpecificAISuggestion[]): number => {
  if (suggestions.length === 0) return 0;
  const total = suggestions.reduce((sum, suggestion) => sum + suggestion.confidence, 0);
  return total / suggestions.length;
};

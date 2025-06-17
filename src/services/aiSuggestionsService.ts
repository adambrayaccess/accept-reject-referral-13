
import { Referral } from '@/types/referral';
import { AISuggestionsResponse, SpecificAISuggestion, TriageStatusSuggestion, AppointmentSuggestion, WaitingListSuggestion, TaggingSuggestion, FollowUpSuggestion, ReviewSuggestion, DocumentationSuggestion } from '@/types/aiSuggestions';

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

  // Status-specific suggestions
  if (referral.status === 'new') {
    suggestions.push(...generateNewReferralSuggestions(referral));
  } else if (referral.status === 'accepted') {
    suggestions.push(...generateAcceptedReferralSuggestions(referral));
  } else if (referral.status === 'rejected') {
    suggestions.push(...generateRejectedReferralSuggestions(referral));
  }

  // Always generate these universal suggestions
  suggestions.push(generateTaggingSuggestion(referral));
  suggestions.push(generateDocumentationSuggestion(referral));
  suggestions.push(...generateFollowUpSuggestions(referral));

  return suggestions.sort((a, b) => b.confidence - a.confidence);
};

const generateNewReferralSuggestions = (referral: Referral): SpecificAISuggestion[] => {
  const suggestions: SpecificAISuggestion[] = [];

  // Review suggestion for new referrals
  suggestions.push(generateReviewSuggestion(referral));

  // Triage status suggestion
  suggestions.push(generateTriageStatusSuggestion(referral));

  // Priority assessment
  if (referral.priority === 'routine') {
    const clinicalInfo = referral.clinicalInfo.reason.toLowerCase();
    if (CLINICAL_PATTERNS.urgent_indicators.some(indicator => clinicalInfo.includes(indicator))) {
      suggestions.push({
        id: `priority-${Date.now()}`,
        type: 'review',
        title: 'Consider upgrading priority',
        description: 'Clinical indicators suggest this may require urgent attention',
        confidence: 0.85,
        reasoning: 'Urgent clinical indicators detected in routine referral',
        priority: 'high',
        actionable: true,
        reviewType: 'priority-assessment',
        recommendedAction: 'Upgrade to urgent priority'
      } as ReviewSuggestion);
    }
  }

  return suggestions;
};

const generateAcceptedReferralSuggestions = (referral: Referral): SpecificAISuggestion[] => {
  const suggestions: SpecificAISuggestion[] = [];

  // Generate appointment suggestion
  suggestions.push(generateAppointmentSuggestion(referral));

  // Generate waiting list suggestion
  suggestions.push(generateWaitingListSuggestion(referral));

  // Triage progression suggestion
  suggestions.push(generateTriageStatusSuggestion(referral));

  return suggestions;
};

const generateRejectedReferralSuggestions = (referral: Referral): SpecificAISuggestion[] => {
  const suggestions: SpecificAISuggestion[] = [];

  // Alternative pathway suggestion
  suggestions.push({
    id: `alternative-${Date.now()}`,
    type: 'review',
    title: 'Consider alternative pathways',
    description: 'Explore other specialties or services that might be appropriate',
    confidence: 0.75,
    reasoning: 'Rejected referrals may benefit from alternative care pathways',
    priority: 'medium',
    actionable: true,
    reviewType: 'alternative-pathway',
    recommendedAction: 'Review alternative specialties or primary care options'
  } as ReviewSuggestion);

  return suggestions;
};

const generateReviewSuggestion = (referral: Referral): ReviewSuggestion => {
  const clinicalInfo = referral.clinicalInfo.reason.toLowerCase();
  let confidence = 0.8;
  let reviewType: ReviewSuggestion['reviewType'] = 'initial-assessment';
  let recommendedAction = 'Complete initial clinical review';

  if (CLINICAL_PATTERNS.urgent_indicators.some(indicator => clinicalInfo.includes(indicator))) {
    confidence = 0.95;
    reviewType = 'urgent-review';
    recommendedAction = 'Immediate clinical review required';
  }

  return {
    id: `review-${Date.now()}`,
    type: 'review',
    title: 'Clinical review required',
    description: `Recommend ${reviewType.replace('-', ' ')} within appropriate timeframe`,
    confidence,
    reasoning: 'New referral requires clinical assessment to determine appropriate care pathway',
    priority: confidence > 0.9 ? 'high' : 'medium',
    actionable: true,
    reviewType,
    recommendedAction
  };
};

const generateTriageStatusSuggestion = (referral: Referral): TriageStatusSuggestion => {
  const clinicalInfo = referral.clinicalInfo.reason.toLowerCase();
  const currentStatus = referral.triageStatus;

  let suggestedStatus: TriageStatusSuggestion['suggestedStatus'] = 'pre-assessment';
  let confidence = 0.7;
  let reasoning = 'Based on clinical information analysis';

  // Status-specific logic
  if (referral.status === 'new') {
    suggestedStatus = 'pre-assessment';
    confidence = 0.9;
    reasoning = 'New referrals should begin with pre-assessment';
  } else if (referral.status === 'accepted') {
    // Analyze urgency and complexity for accepted referrals
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
  }

  return {
    id: `triage-${Date.now()}`,
    type: 'triage-status',
    title: `Recommend ${suggestedStatus.replace('-', ' ')} status`,
    description: `AI suggests updating triage status to ${suggestedStatus.replace('-', ' ')}`,
    confidence,
    reasoning,
    priority: confidence > 0.8 ? 'high' : 'medium',
    actionable: referral.status === 'accepted', // Only actionable for accepted referrals
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
    actionable: false, // Not directly actionable in current system
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
    actionable: false, // Not directly actionable in current system
    suggestedPosition: position,
    estimatedWaitTime: waitTime
  };
};

const generateTaggingSuggestion = (referral: Referral): TaggingSuggestion => {
  const clinicalInfo = referral.clinicalInfo.reason.toLowerCase();
  const existingTags = referral.tags || [];
  const suggestedTags: string[] = [];
  const categories: string[] = [];

  // Status-specific tags
  if (referral.status === 'new') {
    suggestedTags.push('Requires review');
    categories.push('status');
  }

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
    suggestedTags.push('Standard care');
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

const generateDocumentationSuggestion = (referral: Referral): DocumentationSuggestion => {
  const missingFields: string[] = [];
  let confidence = 0.6;

  if (!referral.clinicalInfo.diagnosis) {
    missingFields.push('Provisional diagnosis');
  }
  if (!referral.clinicalInfo.history) {
    missingFields.push('Clinical history');
  }
  if (!referral.clinicalInfo.medications || referral.clinicalInfo.medications.length === 0) {
    missingFields.push('Current medications');
  }
  if (!referral.attachments || referral.attachments.length === 0) {
    missingFields.push('Supporting documents');
  }

  if (missingFields.length > 0) {
    confidence = 0.9;
  }

  return {
    id: `documentation-${Date.now()}`,
    type: 'documentation',
    title: missingFields.length > 0 ? 'Complete missing documentation' : 'Documentation review',
    description: missingFields.length > 0 
      ? `${missingFields.length} key fields require completion`
      : 'Clinical documentation appears complete',
    confidence,
    reasoning: missingFields.length > 0 
      ? 'Missing clinical information may impact care planning'
      : 'Regular documentation review ensures completeness',
    priority: missingFields.length > 2 ? 'high' : 'medium',
    actionable: missingFields.length > 0,
    missingFields,
    completionPercentage: Math.round(((4 - missingFields.length) / 4) * 100)
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
      actionable: false,
      followUpType: 'test-results',
      timeline: '1-2 weeks'
    });
  }

  // Status-specific follow-ups
  if (referral.status === 'new') {
    suggestions.push({
      id: `followup-decision-${Date.now()}`,
      type: 'follow-up',
      title: 'Review and decide on referral',
      description: 'New referral requires acceptance or rejection decision',
      confidence: 0.95,
      reasoning: 'New referrals should be processed within standard timeframes',
      priority: 'high',
      actionable: false,
      followUpType: 'specialist-review',
      timeline: '2-5 days'
    });
  }

  return suggestions;
};

const calculateOverallConfidence = (suggestions: SpecificAISuggestion[]): number => {
  if (suggestions.length === 0) return 0;
  const total = suggestions.reduce((sum, suggestion) => sum + suggestion.confidence, 0);
  return total / suggestions.length;
};

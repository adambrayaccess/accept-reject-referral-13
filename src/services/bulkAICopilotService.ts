
import { Referral } from '@/types/referral';
import { BulkAISuggestionsResponse, SpecificBulkAISuggestion } from '@/types/bulkAISuggestions';

export const generateBulkAICopilotSuggestions = async (
  referrals: Referral[]
): Promise<BulkAISuggestionsResponse> => {
  const startTime = Date.now();
  
  if (referrals.length === 0) {
    return {
      suggestions: [],
      generatedAt: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      confidence: 0,
      selectedReferralsCount: 0
    };
  }

  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

  const suggestions: SpecificBulkAISuggestion[] = [];

  // Analyze referrals for batch tagging opportunities
  const untaggedReferrals = referrals.filter(r => !r.tags || r.tags.length === 0);
  if (untaggedReferrals.length > 0) {
    suggestions.push({
      id: `batch-tag-${Date.now()}`,
      type: 'batch-tagging',
      title: `Tag ${untaggedReferrals.length} Untagged Patients`,
      description: `Apply clinical priority tags to improve workflow efficiency`,
      confidence: 0.85,
      reasoning: `Found ${untaggedReferrals.length} patients without tags. Adding appropriate tags will improve triage and scheduling efficiency.`,
      priority: 'medium',
      actionable: true,
      affectedReferralsCount: untaggedReferrals.length,
      suggestedTags: ['requires-review', 'standard-pathway'],
      categories: ['workflow', 'triage'],
      tagReason: 'Improve workflow categorization and priority routing'
    });
  }

  // Analyze for priority rebalancing
  const urgentReferrals = referrals.filter(r => r.priority === 'urgent');
  const oldUrgentReferrals = urgentReferrals.filter(r => (r.calculatedReferralAge || 0) > 14);
  
  if (oldUrgentReferrals.length > 0) {
    suggestions.push({
      id: `priority-rebalance-${Date.now()}`,
      type: 'priority-rebalancing',
      title: `Escalate ${oldUrgentReferrals.length} Overdue Urgent Cases`,
      description: `Urgent referrals waiting >14 days need immediate attention`,
      confidence: 0.92,
      reasoning: `${oldUrgentReferrals.length} urgent referrals have exceeded the 14-day target. These require immediate escalation.`,
      priority: 'high',
      actionable: true,
      affectedReferralsCount: oldUrgentReferrals.length,
      rebalanceActions: oldUrgentReferrals.map(ref => ({
        referralId: ref.id,
        currentPriority: ref.priority,
        suggestedPriority: 'emergency',
        reason: `Urgent referral waiting ${ref.calculatedReferralAge} days`
      }))
    });
  }

  // Analyze for appointment scheduling optimization
  if (referrals.length >= 3) {
    const locations = referrals.map(r => r.calculatedLocation).filter(Boolean);
    const uniqueLocations = [...new Set(locations)];
    
    if (uniqueLocations.length <= 3 && referrals.length >= 5) {
      suggestions.push({
        id: `appointment-schedule-${Date.now()}`,
        type: 'appointment-scheduling',
        title: `Geographic Batching for ${referrals.length} Patients`,
        description: `Group appointments by location to optimize travel and resource utilization`,
        confidence: 0.78,
        reasoning: `Patients are concentrated in ${uniqueLocations.length} locations. Geographic batching could improve efficiency.`,
        priority: 'medium',
        actionable: true,
        affectedReferralsCount: referrals.length,
        schedulingStrategy: 'geographic-grouping',
        estimatedTimeframe: '2-3 weeks',
        appointmentType: 'consultation'
      });
    }
  }

  // Analyze for report generation opportunities
  if (referrals.length >= 5) {
    const hasVariedWaitTimes = referrals.some(r => (r.calculatedReferralAge || 0) > 60);
    
    if (hasVariedWaitTimes) {
      suggestions.push({
        id: `report-gen-${Date.now()}`,
        type: 'report-generation',
        title: `Waiting Times Analysis Report`,
        description: `Generate comprehensive waiting times report for selected patients`,
        confidence: 0.80,
        reasoning: `Selected patients show varied waiting times. A detailed report could identify bottlenecks and improvement opportunities.`,
        priority: 'low',
        actionable: true,
        affectedReferralsCount: referrals.length,
        reportType: 'waiting-times',
        reportFormat: 'pdf'
      });
    }
  }

  // Workflow optimization suggestions
  const taggedReferrals = referrals.filter(r => r.tags && r.tags.length > 0);
  if (taggedReferrals.length >= 3) {
    suggestions.push({
      id: `workflow-opt-${Date.now()}`,
      type: 'workflow-optimization',
      title: `Optimize Triage Workflow`,
      description: `Streamline pathway routing based on current tag patterns`,
      confidence: 0.75,
      reasoning: `Current tag distribution suggests opportunities for pathway optimization and resource reallocation.`,
      priority: 'medium',
      actionable: true,
      affectedReferralsCount: referrals.length,
      optimizationType: 'triage-efficiency',
      estimatedImpact: '15-20% efficiency improvement'
    });
  }

  const processingTime = Date.now() - startTime;
  const overallConfidence = suggestions.length > 0 
    ? suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length 
    : 0;

  return {
    suggestions: suggestions.slice(0, 4), // Limit to 4 suggestions
    generatedAt: new Date().toISOString(),
    processingTime,
    confidence: overallConfidence,
    selectedReferralsCount: referrals.length
  };
};


import { Referral } from '@/types/referral';
import { SpecialtyStats, OverallStats } from '@/hooks/useAdminStatistics';

export interface AdminAISuggestion {
  id: string;
  type: 'performance' | 'bottleneck' | 'resource' | 'optimization' | 'alert';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actionable: boolean;
  suggestedActions: string[];
  reportType?: string;
  metrics?: Record<string, any>;
}

export interface AdminAIResponse {
  suggestions: AdminAISuggestion[];
  generatedAt: string;
  processingTime: number;
  confidence: number;
  summary: string;
}

const generatePerformanceSuggestions = (
  overallStats: OverallStats,
  specialtyStats: SpecialtyStats[]
): AdminAISuggestion[] => {
  const suggestions: AdminAISuggestion[] = [];

  // Check for high rejection rates
  const rejectionRate = overallStats.total > 0 ? (overallStats.rejected / overallStats.total) * 100 : 0;
  if (rejectionRate > 15) {
    suggestions.push({
      id: 'high-rejection-rate',
      type: 'performance',
      title: 'High Rejection Rate Detected',
      description: `Current rejection rate is ${rejectionRate.toFixed(1)}%, which is above the recommended 15% threshold.`,
      priority: 'high',
      confidence: 0.85,
      actionable: true,
      suggestedActions: [
        'Generate rejection reasons analysis report',
        'Review referral quality guidelines',
        'Analyze most frequently rejected specialties'
      ],
      reportType: 'rejection-analysis',
      metrics: { rejectionRate, threshold: 15 }
    });
  }

  // Check for specialties with long wait times
  const longWaitSpecialties = specialtyStats.filter(s => s.averageWaitDays > 28);
  if (longWaitSpecialties.length > 0) {
    suggestions.push({
      id: 'long-wait-times',
      type: 'bottleneck',
      title: 'Extended Wait Times in Multiple Specialties',
      description: `${longWaitSpecialties.length} specialties have average wait times exceeding 4 weeks.`,
      priority: 'high',
      confidence: 0.90,
      actionable: true,
      suggestedActions: [
        'Generate capacity planning report',
        'Review resource allocation',
        'Consider additional appointment slots'
      ],
      reportType: 'wait-time-analysis',
      metrics: { affectedSpecialties: longWaitSpecialties.length, threshold: 28 }
    });
  }

  // Check for backlog accumulation
  const backlogRate = overallStats.total > 0 ? (overallStats.waitingList / overallStats.total) * 100 : 0;
  if (backlogRate > 30) {
    suggestions.push({
      id: 'backlog-accumulation',
      type: 'resource',
      title: 'Significant Backlog Accumulation',
      description: `${backlogRate.toFixed(1)}% of referrals are currently on waiting lists.`,
      priority: 'medium',
      confidence: 0.80,
      actionable: true,
      suggestedActions: [
        'Generate workflow efficiency report',
        'Analyze processing bottlenecks',
        'Review triage procedures'
      ],
      reportType: 'backlog-analysis',
      metrics: { backlogRate, threshold: 30 }
    });
  }

  return suggestions;
};

const generateOptimizationSuggestions = (specialtyStats: SpecialtyStats[]): AdminAISuggestion[] => {
  const suggestions: AdminAISuggestion[] = [];

  // Find top performing specialties
  const topPerformers = specialtyStats
    .filter(s => s.total >= 10)
    .sort((a, b) => (b.accepted / b.total) - (a.accepted / a.total))
    .slice(0, 2);

  if (topPerformers.length > 0) {
    suggestions.push({
      id: 'best-practices',
      type: 'optimization',
      title: 'Best Practice Opportunities Identified',
      description: `${topPerformers[0].specialty} shows excellent performance metrics that could be replicated.`,
      priority: 'medium',
      confidence: 0.75,
      actionable: true,
      suggestedActions: [
        'Generate best practices comparison report',
        'Conduct workflow analysis',
        'Share successful processes across teams'
      ],
      reportType: 'best-practices-analysis',
      metrics: { topPerformer: topPerformers[0].specialty }
    });
  }

  return suggestions;
};

export const generateAdminAISuggestions = async (
  referrals: Referral[],
  overallStats: OverallStats,
  specialtyStats: SpecialtyStats[]
): Promise<AdminAIResponse> => {
  const startTime = Date.now();

  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const suggestions: AdminAISuggestion[] = [
    ...generatePerformanceSuggestions(overallStats, specialtyStats),
    ...generateOptimizationSuggestions(specialtyStats)
  ];

  // Add critical alerts for extreme cases
  const criticalWaitTime = Math.max(...specialtyStats.map(s => s.longestWaitDays));
  if (criticalWaitTime > 90) {
    suggestions.unshift({
      id: 'critical-wait-time',
      type: 'alert',
      title: 'Critical Wait Time Alert',
      description: `A patient has been waiting ${criticalWaitTime} days, requiring immediate attention.`,
      priority: 'critical',
      confidence: 1.0,
      actionable: true,
      suggestedActions: [
        'Generate urgent cases report',
        'Review patient prioritization',
        'Escalate to clinical lead'
      ],
      reportType: 'urgent-cases',
      metrics: { longestWait: criticalWaitTime }
    });
  }

  const processingTime = Date.now() - startTime;
  const confidence = suggestions.length > 0 ? 
    suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length : 0;

  return {
    suggestions,
    generatedAt: new Date().toISOString(),
    processingTime,
    confidence,
    summary: `Analyzed ${referrals.length} referrals across ${specialtyStats.length} specialties`
  };
};

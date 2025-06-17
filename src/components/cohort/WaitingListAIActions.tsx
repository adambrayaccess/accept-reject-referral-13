
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Referral } from '@/types/referral';

interface WaitingListAIActionsProps {
  referral: Referral;
  variant?: 'default' | 'compact';
}

const WaitingListAIActions = ({ referral, variant = 'default' }: WaitingListAIActionsProps) => {
  // Mock AI suggestions based on referral data
  const getAISuggestions = () => {
    const age = referral.calculatedReferralAge || 0;
    const priority = referral.priority;
    const tags = referral.tags || [];
    
    const suggestions = [];
    
    // Priority-based suggestions
    if (priority === 'urgent' && age > 14) {
      suggestions.push({
        type: 'escalation',
        text: 'Escalate Priority',
        confidence: 95,
        reason: 'Urgent referral waiting >14 days'
      });
    }
    
    // Age-based suggestions
    if (age > 60) {
      suggestions.push({
        type: 'appointment',
        text: 'Book Emergency Slot',
        confidence: 88,
        reason: 'Long wait time detected'
      });
    }
    
    // Tag-based suggestions
    if (tags.includes('two-week-wait') || tags.includes('cancer-suspected')) {
      suggestions.push({
        type: 'fast-track',
        text: 'Fast Track',
        confidence: 92,
        reason: 'Cancer pathway detected'
      });
    }
    
    // Generic optimization
    if (suggestions.length === 0 && age > 30) {
      suggestions.push({
        type: 'optimize',
        text: 'Optimize Slot',
        confidence: 75,
        reason: 'Standard optimization'
      });
    }
    
    return suggestions.slice(0, 2); // Return max 2 suggestions
  };

  const suggestions = getAISuggestions();

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        {suggestions.length > 0 && (
          <>
            <Sparkles className="h-3 w-3 text-purple-500" />
            <span className="text-xs text-purple-600 font-medium">
              {suggestions.length} AI suggestion{suggestions.length > 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <Sparkles className="h-3 w-3" />
        <span>No AI suggestions</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="flex items-start gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-purple-50 border-purple-200 hover:bg-purple-100"
          >
            <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
            {suggestion.text}
          </Button>
          <div className="flex flex-col">
            <Badge variant="secondary" className="text-xs w-fit">
              <TrendingUp className="h-3 w-3 mr-1" />
              {suggestion.confidence}%
            </Badge>
            <span className="text-xs text-muted-foreground mt-1">
              {suggestion.reason}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WaitingListAIActions;

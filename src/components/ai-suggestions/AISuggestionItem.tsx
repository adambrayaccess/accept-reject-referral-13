
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, CheckCircle, AlertCircle, Clock, Tag, Calendar, Users } from 'lucide-react';
import { SpecificAISuggestion } from '@/types/aiSuggestions';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';
import { updateTriageStatus, updateReferralTags } from '@/services/referralService';

interface AISuggestionItemProps {
  suggestion: SpecificAISuggestion;
  referral: Referral;
  onApplied: () => void;
}

const AISuggestionItem = ({ suggestion, referral, onApplied }: AISuggestionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const getSuggestionIcon = () => {
    switch (suggestion.type) {
      case 'triage-status':
        return <CheckCircle className="h-4 w-4" />;
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'waiting-list':
        return <Users className="h-4 w-4" />;
      case 'tagging':
        return <Tag className="h-4 w-4" />;
      case 'follow-up':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = () => {
    switch (suggestion.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleApplySuggestion = async () => {
    if (!suggestion.actionable) return;

    setIsApplying(true);
    try {
      let success = false;

      switch (suggestion.type) {
        case 'triage-status':
          const triageSuggestion = suggestion as any;
          success = await updateTriageStatus(
            referral.id,
            triageSuggestion.suggestedStatus,
            `AI suggested status change: ${suggestion.reasoning}`
          );
          break;

        case 'tagging':
          const taggingSuggestion = suggestion as any;
          const currentTags = referral.tags || [];
          const newTags = [...currentTags, ...taggingSuggestion.suggestedTags];
          success = await updateReferralTags(referral.id, newTags);
          break;

        case 'appointment':
        case 'waiting-list':
        case 'follow-up':
          // These would require integration with appointment/scheduling systems
          toast({
            title: 'Feature Coming Soon',
            description: `${suggestion.type} suggestions will be integrated with scheduling systems`,
          });
          return;

        default:
          toast({
            title: 'Unknown Suggestion Type',
            description: 'This suggestion type is not yet supported',
            variant: 'destructive',
          });
          return;
      }

      if (success) {
        toast({
          title: 'Suggestion Applied',
          description: suggestion.title,
        });
        onApplied();
      } else {
        throw new Error('Failed to apply suggestion');
      }
    } catch (error) {
      console.error('Error applying suggestion:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply suggestion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-100 to-purple-200 border border-purple-200 rounded-lg p-3">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex items-center gap-2 text-purple-700">
              {getSuggestionIcon()}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-medium text-sm text-purple-800">{suggestion.title}</h4>
                <Badge variant="outline" className={`text-xs ${getPriorityColor()}`}>
                  {suggestion.priority}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                  {Math.round(suggestion.confidence * 100)}%
                </Badge>
              </div>
              <p className="text-sm text-purple-700">{suggestion.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {suggestion.actionable && (
              <Button
                size="sm"
                variant="default"
                onClick={handleApplySuggestion}
                disabled={isApplying}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-full px-4"
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </Button>
            )}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-purple-700 hover:text-purple-800 hover:bg-purple-200">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="mt-3 pt-3 border-t border-purple-200">
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-purple-600">Reasoning:</span>
              <p className="text-sm text-purple-800">{suggestion.reasoning}</p>
            </div>
            
            {suggestion.type === 'triage-status' && (
              <div>
                <span className="text-xs font-medium text-purple-600">Suggested Status:</span>
                <p className="text-sm text-purple-800">{(suggestion as any).suggestedStatus}</p>
              </div>
            )}
            
            {suggestion.type === 'appointment' && (
              <div>
                <span className="text-xs font-medium text-purple-600">Urgency:</span>
                <p className="text-sm text-purple-800">{(suggestion as any).urgency} - {(suggestion as any).suggestedTimeframe}</p>
              </div>
            )}
            
            {suggestion.type === 'tagging' && (
              <div>
                <span className="text-xs font-medium text-purple-600">Suggested Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(suggestion as any).suggestedTags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AISuggestionItem;

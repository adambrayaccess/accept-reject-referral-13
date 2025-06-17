
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, CheckCircle, AlertCircle, Clock, Tag, Calendar, Users, FileText, Eye } from 'lucide-react';
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
      case 'review':
        return <Eye className="h-4 w-4" />;
      case 'documentation':
        return <FileText className="h-4 w-4" />;
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
    if (!suggestion.actionable) {
      toast({
        title: 'Suggestion Not Actionable',
        description: 'This suggestion is for informational purposes and cannot be automatically applied',
      });
      return;
    }

    setIsApplying(true);
    try {
      let success = false;

      switch (suggestion.type) {
        case 'triage-status':
          if (referral.status !== 'accepted') {
            toast({
              title: 'Action Not Available',
              description: 'Triage status can only be updated for accepted referrals',
              variant: 'destructive',
            });
            return;
          }
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
        case 'review':
        case 'documentation':
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

  const renderSuggestionDetails = () => {
    switch (suggestion.type) {
      case 'triage-status':
        const triageSuggestion = suggestion as any;
        return (
          <div>
            <span className="text-xs font-medium text-purple-600">Suggested Status:</span>
            <p className="text-sm text-purple-800">{triageSuggestion.suggestedStatus.replace('-', ' ')}</p>
            {triageSuggestion.estimatedTimeframe && (
              <>
                <span className="text-xs font-medium text-purple-600">Timeframe:</span>
                <p className="text-sm text-purple-800">{triageSuggestion.estimatedTimeframe}</p>
              </>
            )}
          </div>
        );
        
      case 'appointment':
        const appointmentSuggestion = suggestion as any;
        return (
          <div>
            <span className="text-xs font-medium text-purple-600">Urgency:</span>
            <p className="text-sm text-purple-800">{appointmentSuggestion.urgency} - {appointmentSuggestion.suggestedTimeframe}</p>
          </div>
        );
        
      case 'tagging':
        const taggingSuggestion = suggestion as any;
        return (
          <div>
            <span className="text-xs font-medium text-purple-600">Suggested Tags:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {taggingSuggestion.suggestedTags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        );
        
      case 'review':
        const reviewSuggestion = suggestion as any;
        return (
          <div>
            <span className="text-xs font-medium text-purple-600">Review Type:</span>
            <p className="text-sm text-purple-800">{reviewSuggestion.reviewType.replace('-', ' ')}</p>
            <span className="text-xs font-medium text-purple-600">Recommended Action:</span>
            <p className="text-sm text-purple-800">{reviewSuggestion.recommendedAction}</p>
          </div>
        );
        
      case 'documentation':
        const docSuggestion = suggestion as any;
        return (
          <div>
            <span className="text-xs font-medium text-purple-600">Completion:</span>
            <p className="text-sm text-purple-800">{docSuggestion.completionPercentage}% complete</p>
            {docSuggestion.missingFields.length > 0 && (
              <>
                <span className="text-xs font-medium text-purple-600">Missing Fields:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {docSuggestion.missingFields.map((field: string) => (
                    <Badge key={field} variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">
                      {field}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        );
        
      case 'follow-up':
        const followUpSuggestion = suggestion as any;
        return (
          <div>
            <span className="text-xs font-medium text-purple-600">Type:</span>
            <p className="text-sm text-purple-800">{followUpSuggestion.followUpType.replace('-', ' ')}</p>
            <span className="text-xs font-medium text-purple-600">Timeline:</span>
            <p className="text-sm text-purple-800">{followUpSuggestion.timeline}</p>
          </div>
        );
        
      default:
        return null;
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
                {!suggestion.actionable && (
                  <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-gray-300">
                    Info only
                  </Badge>
                )}
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
            
            {renderSuggestionDetails()}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AISuggestionItem;

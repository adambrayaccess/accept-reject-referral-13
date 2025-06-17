import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Tag, Users, Calendar, FileText, Settings } from 'lucide-react';
import { SpecificBulkAISuggestion, BatchTaggingSuggestion, PriorityRebalancingSuggestion, AppointmentSchedulingSuggestion } from '@/types/bulkAISuggestions';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';

interface BulkAISuggestionItemProps {
  suggestion: SpecificBulkAISuggestion;
  selectedReferrals: Referral[];
  onApplied: () => void;
}

const BulkAISuggestionItem = ({ suggestion, selectedReferrals, onApplied }: BulkAISuggestionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const getSuggestionIcon = () => {
    switch (suggestion.type) {
      case 'batch-tagging':
        return <Tag className="h-4 w-4" />;
      case 'priority-rebalancing':
        return <Users className="h-4 w-4" />;
      case 'appointment-scheduling':
        return <Calendar className="h-4 w-4" />;
      case 'report-generation':
        return <FileText className="h-4 w-4" />;
      case 'workflow-optimization':
        return <Settings className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
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
      // Simulate applying the suggestion
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      let successMessage = '';
      
      switch (suggestion.type) {
        case 'batch-tagging':
          const taggingSuggestion = suggestion as BatchTaggingSuggestion;
          successMessage = `Applied tags "${taggingSuggestion.suggestedTags.join(', ')}" to ${suggestion.affectedReferralsCount} patients`;
          break;
        case 'priority-rebalancing':
          successMessage = `Rebalanced priority for ${suggestion.affectedReferralsCount} patients`;
          break;
        case 'appointment-scheduling':
          successMessage = `Optimized scheduling for ${suggestion.affectedReferralsCount} patients`;
          break;
        case 'report-generation':
          successMessage = `Generated report for ${suggestion.affectedReferralsCount} patients`;
          break;
        case 'workflow-optimization':
          successMessage = `Applied workflow optimization for ${suggestion.affectedReferralsCount} patients`;
          break;
        default:
          // Cast to base type to access common properties
          const baseSuggestion = suggestion as SpecificBulkAISuggestion;
          successMessage = `Applied ${baseSuggestion.type} action for ${baseSuggestion.affectedReferralsCount} patients`;
          break;
      }

      toast({
        title: 'AI Copilot Action Applied',
        description: successMessage,
      });
      
      onApplied();
    } catch (error) {
      console.error('Error applying bulk suggestion:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply AI Copilot action. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-purple-100 border border-purple-200 rounded-lg p-3">
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
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {suggestion.affectedReferralsCount} patients
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
                {isApplying ? 'Applying...' : 'Apply to All'}
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
            
            {suggestion.type === 'batch-tagging' && (
              <div>
                <span className="text-xs font-medium text-purple-600">Suggested Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(suggestion as BatchTaggingSuggestion).suggestedTags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {suggestion.type === 'priority-rebalancing' && (
              <div>
                <span className="text-xs font-medium text-purple-600">Rebalancing Actions:</span>
                <p className="text-sm text-purple-800">
                  {(suggestion as PriorityRebalancingSuggestion).rebalanceActions?.length || 0} priority adjustments recommended
                </p>
              </div>
            )}
            
            {suggestion.type === 'appointment-scheduling' && (
              <div>
                <span className="text-xs font-medium text-purple-600">Strategy:</span>
                <p className="text-sm text-purple-800">
                  {(suggestion as AppointmentSchedulingSuggestion).schedulingStrategy} - {(suggestion as AppointmentSchedulingSuggestion).estimatedTimeframe}
                </p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default BulkAISuggestionItem;

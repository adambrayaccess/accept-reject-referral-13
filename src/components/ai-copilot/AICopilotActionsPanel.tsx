
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, RefreshCw, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Referral } from '@/types/referral';
import { BulkAISuggestionsResponse } from '@/types/bulkAISuggestions';
import { generateBulkAICopilotSuggestions } from '@/services/bulkAICopilotService';
import { useToast } from '@/hooks/use-toast';
import BulkAISuggestionItem from './BulkAISuggestionItem';

interface AICopilotActionsPanelProps {
  selectedReferrals: Referral[];
  onSuggestionApplied: () => void;
}

const AICopilotActionsPanel = ({ selectedReferrals, onSuggestionApplied }: AICopilotActionsPanelProps) => {
  const [suggestions, setSuggestions] = useState<BulkAISuggestionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const loadSuggestions = async () => {
    if (selectedReferrals.length === 0) {
      setSuggestions(null);
      return;
    }

    setIsLoading(true);
    try {
      const bulkSuggestions = await generateBulkAICopilotSuggestions(selectedReferrals);
      setSuggestions(bulkSuggestions);
      
      // Auto-expand if we have high-priority suggestions
      const hasHighPriority = bulkSuggestions.suggestions.some(s => s.priority === 'high');
      if (hasHighPriority && !isExpanded) {
        setIsExpanded(true);
      }
    } catch (error) {
      console.error('Error loading AI Copilot suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI Copilot actions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, [selectedReferrals]);

  const handleRefresh = () => {
    loadSuggestions();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (selectedReferrals.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-700" />
            <CardTitle className="text-lg text-purple-800">AI Copilot Actions</CardTitle>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              <Users className="h-3 w-3 mr-1" />
              {selectedReferrals.length} selected
            </Badge>
            {suggestions && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getConfidenceColor(suggestions.confidence)}`}
              >
                {Math.round(suggestions.confidence * 100)}% confidence
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-purple-700 hover:text-purple-800 hover:bg-purple-200"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-700 hover:text-purple-800 hover:bg-purple-200"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-purple-600">
                <Brain className="h-5 w-5 animate-pulse" />
                <span>Analyzing {selectedReferrals.length} selected patients...</span>
              </div>
            </div>
          ) : suggestions && suggestions.suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.suggestions.map((suggestion, index) => (
                <div key={suggestion.id}>
                  <BulkAISuggestionItem
                    suggestion={suggestion}
                    selectedReferrals={selectedReferrals}
                    onApplied={onSuggestionApplied}
                  />
                  {index < suggestions.suggestions.length - 1 && <Separator className="mt-3 bg-purple-200" />}
                </div>
              ))}
              
              <div className="pt-3 mt-3 border-t border-purple-200">
                <div className="text-xs text-purple-600">
                  Generated in {suggestions.processingTime}ms at {new Date(suggestions.generatedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-purple-600">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No AI Copilot actions available for the current selection</p>
              <p className="text-sm text-purple-500 mt-1">Try selecting different patients or refresh to re-analyze</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default AICopilotActionsPanel;


import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Referral } from '@/types/referral';
import { AISuggestionsResponse } from '@/types/aiSuggestions';
import { generateAISuggestions } from '@/services/aiSuggestionsService';
import { useToast } from '@/hooks/use-toast';
import AISuggestionItem from './AISuggestionItem';

interface AISuggestionsPanelProps {
  referral: Referral;
  onSuggestionApplied: () => void;
}

const AISuggestionsPanel = ({ referral, onSuggestionApplied }: AISuggestionsPanelProps) => {
  const [suggestions, setSuggestions] = useState<AISuggestionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded in sheet
  const { toast } = useToast();

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const aiSuggestions = await generateAISuggestions(referral);
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI suggestions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, [referral.id, referral.status, referral.triageStatus]);

  const handleRefresh = () => {
    loadSuggestions();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusColor = () => {
    switch (referral.status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionableSuggestionsCount = () => {
    if (!suggestions) return 0;
    return suggestions.suggestions.filter(s => s.actionable).length;
  };

  return (
    <Card className="bg-gradient-to-r from-pink-50 to-purple-100 border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-700" />
            <CardTitle className="text-lg text-purple-800">AI Copilot Suggestions</CardTitle>
            <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
              {referral.status}
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
        {suggestions && suggestions.suggestions.length > 0 && (
          <div className="text-xs text-purple-600">
            {suggestions.suggestions.length} suggestions • {getActionableSuggestionsCount()} actionable
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>Analyzing referral...</span>
              </div>
            </div>
          ) : suggestions && suggestions.suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.suggestions.map((suggestion, index) => (
                <div key={suggestion.id}>
                  <AISuggestionItem
                    suggestion={suggestion}
                    referral={referral}
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
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No AI suggestions available at this time</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default AISuggestionsPanel;


import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();

  const loadSuggestions = async () => {
    console.log('AISuggestionsPanel - Loading suggestions for referral:', referral.id);
    setIsLoading(true);
    try {
      const aiSuggestions = await generateAISuggestions(referral);
      console.log('AISuggestionsPanel - Generated suggestions:', aiSuggestions);
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
    console.log('AISuggestionsPanel - Component mounted, referral ID:', referral.id);
    loadSuggestions();
  }, [referral.id]);

  const handleRefresh = () => {
    loadSuggestions();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  console.log('AISuggestionsPanel - Rendering with:', {
    isLoading,
    suggestions: suggestions ? `${suggestions.suggestions.length} suggestions` : 'null',
    isExpanded
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">AI Triage Suggestions</CardTitle>
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
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
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
              <div className="flex items-center gap-2 text-muted-foreground">
                <Brain className="h-5 w-5 animate-pulse" />
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
                  {index < suggestions.suggestions.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
              
              <div className="pt-3 mt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  Generated in {suggestions.processingTime}ms at {new Date(suggestions.generatedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No AI suggestions available at this time</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default AISuggestionsPanel;

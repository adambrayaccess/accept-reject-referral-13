
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Activity, Target } from 'lucide-react';
import { Referral } from '@/types/referral';
import { SpecialtyStats, OverallStats } from '@/hooks/useAdminStatistics';
import { AdminAIResponse, AdminAISuggestion, generateAdminAISuggestions } from '@/services/adminAIService';
import { useToast } from '@/hooks/use-toast';

interface AdminAICopilotProps {
  referrals: Referral[];
  overallStats: OverallStats;
  specialtyStats: SpecialtyStats[];
}

const AdminAICopilot = ({ referrals, overallStats, specialtyStats }: AdminAICopilotProps) => {
  const [suggestions, setSuggestions] = useState<AdminAIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await generateAdminAISuggestions(referrals, overallStats, specialtyStats);
      setSuggestions(response);
    } catch (error) {
      console.error('Error loading admin AI suggestions:', error);
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
    if (referrals.length > 0) {
      loadSuggestions();
    }
  }, [referrals.length, overallStats, specialtyStats.length]);

  const getTypeIcon = (type: AdminAISuggestion['type']) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'performance': return TrendingUp;
      case 'bottleneck': return Activity;
      default: return Target;
    }
  };

  const getTypeColor = (type: AdminAISuggestion['type'], priority: AdminAISuggestion['priority']) => {
    if (priority === 'critical') return 'text-red-600 bg-red-50 border-red-200';
    
    switch (type) {
      case 'alert': return 'text-red-600 bg-red-50 border-red-200';
      case 'performance': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'bottleneck': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'resource': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'optimization': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };

  const getPriorityColor = (priority: AdminAISuggestion['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const handleGenerateReport = (suggestion: AdminAISuggestion) => {
    toast({
      title: 'Report Generation',
      description: `Generating ${suggestion.reportType || 'analysis'} report...`,
    });
    // This would integrate with actual report generation service
  };

  return (
    <Card className="bg-gradient-to-r from-pink-50 to-purple-100 border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-700" />
            <CardTitle className="text-lg text-purple-800">AI Admin Copilot</CardTitle>
            {suggestions && (
              <Badge 
                variant="outline" 
                className="text-xs bg-purple-100 text-purple-800 border-purple-200"
              >
                {Math.round(suggestions.confidence * 100)}% confidence
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadSuggestions}
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
        {suggestions && isExpanded && (
          <p className="text-sm text-purple-600">{suggestions.summary}</p>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>Analyzing system performance...</span>
              </div>
            </div>
          ) : suggestions && suggestions.suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.suggestions.map((suggestion, index) => {
                const IconComponent = getTypeIcon(suggestion.type);
                
                return (
                  <div key={suggestion.id}>
                    <div className={`p-4 rounded-lg border ${getTypeColor(suggestion.type, suggestion.priority)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <IconComponent className="h-5 w-5 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{suggestion.title}</h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                              >
                                {suggestion.priority}
                              </Badge>
                            </div>
                            <p className="text-sm mb-3">{suggestion.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      {suggestion.suggestedActions.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Suggested Actions:</h5>
                          <ul className="text-sm space-y-1">
                            {suggestion.suggestedActions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-current rounded-full" />
                                {action}
                              </li>
                            ))}
                          </ul>
                          
                          {suggestion.reportType && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateReport(suggestion)}
                              className="mt-2"
                            >
                              Generate Report
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    {index < suggestions.suggestions.length - 1 && <Separator className="mt-4 bg-purple-200" />}
                  </div>
                );
              })}
              
              <div className="pt-3 mt-3 border-t border-purple-200">
                <div className="text-xs text-purple-600">
                  Generated in {suggestions.processingTime}ms at {new Date(suggestions.generatedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-purple-600">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No AI insights available at this time</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default AdminAICopilot;

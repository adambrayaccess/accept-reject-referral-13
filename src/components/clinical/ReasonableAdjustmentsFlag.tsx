
import { Flag } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { ReasonableAdjustmentsFlag as RAFlag } from '@/types/reasonable-adjustments';
import { format } from 'date-fns';

interface ReasonableAdjustmentsFlagProps {
  adjustmentsFlag?: RAFlag;
}

const ReasonableAdjustmentsFlag = ({ adjustmentsFlag }: ReasonableAdjustmentsFlagProps) => {
  console.log('ReasonableAdjustmentsFlag - Data check:', {
    adjustmentsFlag,
    hasAdjustments: adjustmentsFlag?.hasAdjustments,
    adjustmentsArray: adjustmentsFlag?.adjustments,
    adjustmentsLength: adjustmentsFlag?.adjustments?.length
  });
  
  const hasValidAdjustments = adjustmentsFlag && 
    adjustmentsFlag.hasAdjustments === true && 
    Array.isArray(adjustmentsFlag.adjustments) && 
    adjustmentsFlag.adjustments.length > 0;
    
  console.log('hasValidAdjustments result:', hasValidAdjustments);
  
  if (!hasValidAdjustments) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-pointer">
            <Flag className="h-5 w-5 text-gray-400" />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Reasonable Adjustments</h4>
            <p className="text-sm text-muted-foreground">No reasonable adjustments recorded</p>
            {/* Debug info in dev mode */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-red-500 mt-2 p-2 bg-red-50 rounded">
                Debug: {!adjustmentsFlag ? 'No adjustmentsFlag prop' : 
                       !adjustmentsFlag.hasAdjustments ? 'hasAdjustments is false' :
                       !adjustmentsFlag.adjustments ? 'No adjustments array' :
                       adjustmentsFlag.adjustments.length === 0 ? 'Empty adjustments array' : 'Unknown issue'}
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  const getFlagColor = (level: string) => {
    switch (level) {
      case 'complex':
        return 'text-red-500';
      case 'standard':
        return 'text-amber-500';
      default:
        return 'text-gray-400';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'communication': 'Communication',
      'mobility': 'Mobility',
      'sensory': 'Sensory',
      'cognitive': 'Cognitive',
      'mental-health': 'Mental Health',
      'other': 'Other'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const flagColor = getFlagColor(adjustmentsFlag.flagLevel);
  const activeAdjustments = adjustmentsFlag.adjustments.filter(adj => adj.status === 'active');

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">
          <Flag className={`h-5 w-5 ${flagColor}`} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Reasonable Adjustments</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs capitalize">
                {adjustmentsFlag.flagLevel}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {activeAdjustments.length} active
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            {activeAdjustments.slice(0, 3).map((adjustment) => (
              <div key={adjustment.id} className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryLabel(adjustment.category)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(adjustment.dateRecorded), 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="text-sm font-medium">{adjustment.description}</div>
                <div className="text-xs text-muted-foreground">{adjustment.specificNeeds}</div>
                {adjustment.implementationNotes && (
                  <div className="text-xs bg-background p-2 rounded border">
                    <strong>Implementation:</strong> {adjustment.implementationNotes}
                  </div>
                )}
              </div>
            ))}
            
            {activeAdjustments.length > 3 && (
              <div className="text-xs text-muted-foreground text-center pt-1">
                +{activeAdjustments.length - 3} more adjustments
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground border-t pt-2">
            Last updated: {format(new Date(adjustmentsFlag.lastUpdated), 'dd MMM yyyy')} by {adjustmentsFlag.updatedBy}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ReasonableAdjustmentsFlag;


import { Badge } from '@/components/ui/badge';
import { CarePathway } from '@/types/referral';
import { getCarePathwayStatusColor, formatCarePathwayName } from '@/utils/carePathwayUtils';

interface CarePathwayBadgeProps {
  carePathway: CarePathway;
  variant?: 'default' | 'compact';
}

const CarePathwayBadge = ({ carePathway, variant = 'default' }: CarePathwayBadgeProps) => {
  const statusColor = getCarePathwayStatusColor(carePathway.status);
  
  if (variant === 'compact') {
    return (
      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium text-gray-900 truncate" title={carePathway.name}>
          {formatCarePathwayName(carePathway)}
        </div>
        <Badge 
          variant="secondary" 
          className={`text-xs w-fit ${statusColor}`}
        >
          {carePathway.status}
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-900">
        {formatCarePathwayName(carePathway)}
      </div>
      <div className="flex gap-2">
        <Badge 
          variant="secondary" 
          className={`text-xs ${statusColor}`}
        >
          {carePathway.status}
        </Badge>
        {carePathway.targetTimeframe && (
          <Badge variant="outline" className="text-xs">
            Target: {carePathway.targetTimeframe}
          </Badge>
        )}
      </div>
      {carePathway.description && (
        <div className="text-xs text-muted-foreground">
          {carePathway.description}
        </div>
      )}
    </div>
  );
};

export default CarePathwayBadge;

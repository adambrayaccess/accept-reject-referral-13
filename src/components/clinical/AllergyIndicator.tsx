
import { TriangleAlert } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Allergy, AllergySeverity } from '@/types/allergy';
import AllergySeverityBadge from './AllergySeverityBadge';

interface AllergyIndicatorProps {
  allergies?: Allergy[];
}

const AllergyIndicator = ({ allergies }: AllergyIndicatorProps) => {
  console.log('AllergyIndicator - Received allergies:', allergies);
  
  const activeAllergies = allergies?.filter(allergy => allergy.status === 'active') || [];
  
  console.log('AllergyIndicator - Active allergies:', activeAllergies);
  
  const getAllergyStatus = () => {
    if (activeAllergies.length === 0) {
      return 'none';
    }
    
    const hasSevere = activeAllergies.some(allergy => 
      allergy.severity === 'severe' || allergy.severity === 'life-threatening'
    );
    
    if (hasSevere) {
      return 'severe';
    }
    
    return 'mild';
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'severe':
        return 'text-red-500';
      case 'mild':
        return 'text-amber-500';
      default:
        return 'text-gray-400';
    }
  };

  const allergyStatus = getAllergyStatus();
  const iconColor = getIconColor(allergyStatus);

  console.log('AllergyIndicator - Status and color:', { allergyStatus, iconColor });

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">
          <TriangleAlert className={`h-5 w-5 ${iconColor}`} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Allergy Information</h4>
            <Badge variant="outline" className="text-xs">
              {activeAllergies.length} active
            </Badge>
          </div>
          
          {activeAllergies.length === 0 ? (
            <p className="text-sm text-muted-foreground">No known active allergies</p>
          ) : (
            <div className="space-y-2">
              {activeAllergies.slice(0, 3).map((allergy) => (
                <div key={allergy.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{allergy.allergen}</div>
                    <div className="text-xs text-muted-foreground capitalize">{allergy.type}</div>
                  </div>
                  <AllergySeverityBadge severity={allergy.severity} size="sm" />
                </div>
              ))}
              
              {activeAllergies.length > 3 && (
                <div className="text-xs text-muted-foreground text-center pt-1">
                  +{activeAllergies.length - 3} more allergies
                </div>
              )}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AllergyIndicator;

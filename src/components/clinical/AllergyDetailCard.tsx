
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Allergy } from '@/types/allergy';
import AllergySeverityBadge from './AllergySeverityBadge';
import { format } from 'date-fns';

interface AllergyDetailCardProps {
  allergy: Allergy;
}

const AllergyDetailCard = ({ allergy }: AllergyDetailCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'suspected': return 'bg-yellow-100 text-yellow-800';
      case 'unlikely': return 'bg-orange-100 text-orange-800';
      case 'refuted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-3">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{allergy.allergen}</CardTitle>
          <div className="flex items-center gap-2">
            <AllergySeverityBadge severity={allergy.severity} />
            <Badge className={getStatusColor(allergy.status)}>
              {allergy.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs font-medium text-muted-foreground">Allergy Type</div>
            <div className="font-medium capitalize">{allergy.type}</div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground">Verification Status</div>
            <Badge className={getVerificationColor(allergy.verificationStatus)}>
              {allergy.verificationStatus}
            </Badge>
          </div>
          
          {allergy.onsetDate && (
            <div>
              <div className="text-xs font-medium text-muted-foreground">Onset Date</div>
              <div className="font-medium">{format(new Date(allergy.onsetDate), 'dd MMM yyyy')}</div>
            </div>
          )}
          
          {allergy.lastReactionDate && (
            <div>
              <div className="text-xs font-medium text-muted-foreground">Last Reaction</div>
              <div className="font-medium">{format(new Date(allergy.lastReactionDate), 'dd MMM yyyy')}</div>
            </div>
          )}
        </div>

        {allergy.reactions.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Reactions</div>
              <div className="flex flex-wrap gap-1">
                {allergy.reactions.map((reaction, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {reaction.type.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {allergy.notes && (
          <>
            <Separator />
            <div>
              <div className="text-xs font-medium text-muted-foreground">Clinical Notes</div>
              <div className="text-sm mt-1">{allergy.notes}</div>
            </div>
          </>
        )}

        <Separator />
        <div className="text-xs text-muted-foreground">
          Recorded by {allergy.recordedBy} on {format(new Date(allergy.recordedDate), 'dd MMM yyyy')}
        </div>
      </CardContent>
    </Card>
  );
};

export default AllergyDetailCard;

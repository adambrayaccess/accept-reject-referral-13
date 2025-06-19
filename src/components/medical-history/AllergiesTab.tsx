import { Allergy } from '@/types/medical';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

interface AllergiesTabProps {
  allergies: Allergy[] | undefined;
}

const AllergiesTab = ({ allergies }: AllergiesTabProps) => {
  console.log('AllergiesTab: Received allergies data:', allergies);
  
  const hasAllergies = allergies && allergies.length > 0;

  if (!hasAllergies) {
    return <p className="text-muted-foreground">No known allergies recorded for this patient.</p>;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'life-threatening':
        return 'destructive';
      case 'severe':
        return 'destructive';
      case 'moderate':
        return 'secondary';
      case 'mild':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'resolved':
        return 'secondary';
      case 'unverified':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-3">
      {allergies.map((allergy) => (
        <Card key={allergy.id} className="p-0">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-base">{allergy.allergen}</h4>
                  {(allergy.severity === 'severe' || allergy.severity === 'life-threatening') && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getSeverityColor(allergy.severity)} className="text-xs">
                    {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}
                  </Badge>
                  <Badge variant={getStatusColor(allergy.status)} className="text-xs">
                    {allergy.status.charAt(0).toUpperCase() + allergy.status.slice(1)}
                  </Badge>
                </div>

                <div className="text-sm">
                  <div className="text-xs font-medium text-muted-foreground">Reaction</div>
                  <div>{allergy.reaction}</div>
                </div>

                {allergy.notes && (
                  <div className="text-sm">
                    <div className="text-xs font-medium text-muted-foreground">Notes</div>
                    <div>{allergy.notes}</div>
                  </div>
                )}

                <div className="flex gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Recorded:</span> {format(new Date(allergy.recordedDate), 'dd MMM yyyy')}
                  </div>
                  <div>
                    <span className="font-medium">By:</span> {allergy.recordedBy}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AllergiesTab;

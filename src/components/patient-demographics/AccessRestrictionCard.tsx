
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface AccessRestrictionCardProps {
  patient: Patient;
}

const AccessRestrictionCard = ({ patient }: AccessRestrictionCardProps) => {
  if (!patient.accessRestriction?.isRestricted) {
    return null;
  }

  const restriction = patient.accessRestriction;
  
  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'maximum': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'standard': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Access Restriction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className={getLevelColor(restriction.level)}>
            <Shield className="h-3 w-3 mr-1" />
            {restriction.level?.toUpperCase() || 'RESTRICTED'} ACCESS
          </Badge>
        </div>
        
        {restriction.reason && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Reason</label>
            <p className="text-sm">{restriction.reason}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {restriction.appliedDate && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Applied Date</label>
              <p>{format(new Date(restriction.appliedDate), 'dd MMM yyyy')}</p>
            </div>
          )}
          {restriction.appliedBy && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Applied By</label>
              <p>{restriction.appliedBy}</p>
            </div>
          )}
          {restriction.reviewDate && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Review Date</label>
              <p>{format(new Date(restriction.reviewDate), 'dd MMM yyyy')}</p>
            </div>
          )}
        </div>
        
        {restriction.notes && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Notes</label>
            <p className="text-sm bg-white p-2 rounded border">{restriction.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessRestrictionCard;

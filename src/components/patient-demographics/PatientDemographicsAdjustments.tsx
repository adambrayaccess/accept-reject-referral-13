
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accessibility, Calendar, User, ClipboardList, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ReasonableAdjustmentsFlag } from '@/types/reasonable-adjustments';

interface PatientDemographicsAdjustmentsProps {
  adjustmentsFlag: ReasonableAdjustmentsFlag;
}

const PatientDemographicsAdjustments = ({ adjustmentsFlag }: PatientDemographicsAdjustmentsProps) => {
  const activeAdjustments = adjustmentsFlag.adjustments.filter(adj => adj.status === 'active');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-blue-500" />
          Reasonable Adjustments
          <Badge variant={adjustmentsFlag.flagLevel === 'complex' || adjustmentsFlag.flagLevel === 'high' ? 'destructive' : 'secondary'}>
            {adjustmentsFlag.flagLevel} level
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeAdjustments.map((adjustment, index) => (
          <div key={adjustment.id}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-lg">{adjustment.description}</h4>
                 <Badge variant="outline" className="capitalize">
                   {adjustment.category?.replace('-', ' ') || 'Unknown category'}
                 </Badge>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <ClipboardList className="h-3 w-3" />
                  Specific Needs
                </label>
                <p className="text-sm mt-1">{adjustment.specificNeeds}</p>
              </div>
              
              {adjustment.implementationNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Implementation Notes
                  </label>
                  <p className="text-sm mt-1">{adjustment.implementationNotes}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Recorded: {format(new Date(adjustment.dateRecorded), 'dd MMM yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  By: {adjustment.recordedBy}
                </div>
                {adjustment.reviewDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Review: {format(new Date(adjustment.reviewDate), 'dd MMM yyyy')}
                  </div>
                )}
              </div>
            </div>
            
            {index < activeAdjustments.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
        
        {activeAdjustments.length === 0 && (
          <p className="text-muted-foreground text-sm">No active adjustments recorded</p>
        )}
        
        <Separator />
        
        <div className="text-xs text-muted-foreground flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Last updated by: {adjustmentsFlag.updatedBy}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(adjustmentsFlag.lastUpdated), 'dd MMM yyyy')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDemographicsAdjustments;

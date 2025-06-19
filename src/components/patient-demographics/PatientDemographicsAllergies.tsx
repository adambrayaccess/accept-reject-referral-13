
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { Allergy } from '@/types/allergy';
import AllergySeverityBadge from '@/components/clinical/AllergySeverityBadge';

interface PatientDemographicsAllergiesProps {
  allergies: Allergy[];
}

const PatientDemographicsAllergies = ({ allergies }: PatientDemographicsAllergiesProps) => {
  const activeAllergies = allergies.filter(allergy => allergy.status === 'active');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Allergies & Intolerances
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeAllergies.map((allergy, index) => (
          <div key={allergy.id}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-lg">{allergy.allergen}</h4>
                <div className="flex items-center gap-2">
                  <AllergySeverityBadge severity={allergy.severity} />
                  <Badge variant="outline" className="capitalize">
                    {allergy.type}
                  </Badge>
                </div>
              </div>
              
              {allergy.reactions && allergy.reactions.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reactions</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {allergy.reactions.map((reaction, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {reaction.type.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {allergy.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-sm mt-1">{allergy.notes}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Recorded: {format(new Date(allergy.recordedDate), 'dd MMM yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  By: {allergy.recordedBy}
                </div>
                <div>
                  Status: <span className="capitalize">{allergy.verificationStatus}</span>
                </div>
              </div>
            </div>
            
            {index < activeAllergies.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
        
        {activeAllergies.length === 0 && (
          <p className="text-muted-foreground text-sm">No active allergies recorded</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientDemographicsAllergies;

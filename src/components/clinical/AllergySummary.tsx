
import { Allergy } from '@/types/allergy';
import AllergyAlert from './AllergyAlert';
import AllergyDetailCard from './AllergyDetailCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield } from 'lucide-react';

interface AllergySummaryProps {
  allergies?: Allergy[];
  showDetails?: boolean;
}

const AllergySummary = ({ allergies = [], showDetails = false }: AllergySummaryProps) => {
  const activeAllergies = allergies.filter(a => a.status === 'active');
  const criticalAllergies = activeAllergies.filter(a => 
    a.severity === 'life-threatening' || a.severity === 'severe'
  );

  if (allergies.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Allergies
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
              No Known Allergies
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            No allergies recorded for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Critical Allergy Alerts */}
      {criticalAllergies.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Allergy Alerts
              <Badge variant="destructive" className="text-xs">
                {criticalAllergies.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {criticalAllergies.map(allergy => (
              <AllergyAlert key={allergy.id} allergy={allergy} compact />
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Allergies Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              Allergies & Intolerances
              <Badge variant="outline" className="text-xs">
                {activeAllergies.length} Active
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-1">
              {criticalAllergies.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {criticalAllergies.length} Critical
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {showDetails ? (
            <div className="space-y-3">
              {allergies.map(allergy => (
                <AllergyDetailCard key={allergy.id} allergy={allergy} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {allergies.map(allergy => (
                <div key={allergy.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{allergy.allergen}</span>
                    <Badge 
                      variant={allergy.severity === 'life-threatening' || allergy.severity === 'severe' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {allergy.severity}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {allergy.type} • {allergy.status}
                  </div>
                  {allergy.reactions.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Reactions: {allergy.reactions.slice(0, 2).map(r => r.type.replace('_', ' ')).join(', ')}
                      {allergy.reactions.length > 2 && ` +${allergy.reactions.length - 2} more`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllergySummary;

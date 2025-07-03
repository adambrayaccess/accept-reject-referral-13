
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import AllergyIndicator from '@/components/clinical/AllergyIndicator';
import ReasonableAdjustmentsFlag from '@/components/clinical/ReasonableAdjustmentsFlag';

interface ClinicalAlertsCardProps {
  patient: Patient;
}

const ClinicalAlertsCard = ({ patient }: ClinicalAlertsCardProps) => {
  const hasAllergies = patient.allergies && patient.allergies.length > 0;
  const hasAdjustments = patient.reasonableAdjustments?.hasAdjustments;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Clinical Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <AllergyIndicator allergies={patient.allergies} />
          <ReasonableAdjustmentsFlag adjustmentsFlag={patient.reasonableAdjustments} />
          {!hasAllergies && !hasAdjustments && (
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Heart className="h-3 w-3 mr-1" />
              No clinical alerts
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalAlertsCard;

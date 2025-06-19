
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface RecordInformationCardProps {
  patient: Patient;
}

const RecordInformationCard = ({ patient }: RecordInformationCardProps) => {
  const hasAdjustments = patient.reasonableAdjustments?.hasAdjustments;

  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Record Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Patient ID: {patient.id}</p>
          <p>Record last accessed: {format(new Date(), 'dd MMM yyyy, HH:mm')}</p>
          {hasAdjustments && (
            <p>Adjustments last updated: {format(new Date(patient.reasonableAdjustments!.lastUpdated), 'dd MMM yyyy')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordInformationCard;

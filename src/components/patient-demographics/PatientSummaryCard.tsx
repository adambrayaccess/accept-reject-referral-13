
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { User, Phone, MapPin, Calendar } from 'lucide-react';

interface PatientSummaryCardProps {
  patient: Patient;
  age: number;
}

const PatientSummaryCard = ({ patient, age }: PatientSummaryCardProps) => {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-6 w-6" />
          {patient.name}
        </CardTitle>
        {patient.pronouns && (
          <Badge variant="secondary" className="w-fit text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
            {patient.pronouns}
          </Badge>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="font-mono">
            NHS: {patient.nhsNumber}
          </Badge>
          <Badge variant="outline">
            {age} years old
          </Badge>
          <Badge variant="outline" className="capitalize">
            {patient.gender}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Born {format(new Date(patient.birthDate), 'dd MMMM yyyy')}</span>
          </div>
          {patient.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.phone}</span>
            </div>
          )}
        </div>
        {patient.address && (
          <div className="flex items-start gap-2 mt-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-sm">{patient.address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientSummaryCard;

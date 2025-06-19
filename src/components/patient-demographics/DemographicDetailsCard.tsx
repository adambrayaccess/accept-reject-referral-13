
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { FileText, Calendar, Home } from 'lucide-react';

interface DemographicDetailsCardProps {
  patient: Patient;
  age: number;
}

const DemographicDetailsCard = ({ patient, age }: DemographicDetailsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Demographic Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg font-semibold">{patient.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(patient.birthDate), 'dd MMMM yyyy')} ({age} years)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <p className="capitalize">{patient.gender}</p>
            </div>
            {patient.ethnicity && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ethnicity</label>
                <p>{patient.ethnicity}</p>
              </div>
            )}
            {patient.accommodationType && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Accommodation Type</label>
                <p className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {patient.accommodationType}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">NHS Number</label>
              <p className="font-mono text-lg">{patient.nhsNumber}</p>
            </div>
            {patient.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Number</label>
                <p>{patient.phone}</p>
              </div>
            )}
            {patient.address && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Address</label>
                <p className="text-sm">{patient.address}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemographicDetailsCard;

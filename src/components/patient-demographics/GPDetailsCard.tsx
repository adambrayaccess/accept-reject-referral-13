
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MapPin, Phone } from 'lucide-react';

interface GPDetailsCardProps {
  patient: Patient;
}

const GPDetailsCard = ({ patient }: GPDetailsCardProps) => {
  if (!patient.gpDetails) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Primary Care Provider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">GP Name</label>
            <p className="font-medium">{patient.gpDetails.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Practice</label>
            <p>{patient.gpDetails.practice}</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Address
          </label>
          <p className="text-sm">{patient.gpDetails.address}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Phone
            </label>
            <p className="text-sm">{patient.gpDetails.phone}</p>
          </div>
          {patient.gpDetails.email && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm">{patient.gpDetails.email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GPDetailsCard;

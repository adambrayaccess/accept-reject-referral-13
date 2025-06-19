
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { User, Phone, MapPin, Calendar, Shield, Heart, AlertTriangle } from 'lucide-react';
import AllergyIndicator from '@/components/clinical/AllergyIndicator';
import ReasonableAdjustmentsFlag from '@/components/clinical/ReasonableAdjustmentsFlag';
import PatientDemographicsAllergies from './PatientDemographicsAllergies';
import PatientDemographicsAdjustments from './PatientDemographicsAdjustments';

interface PatientDemographicsContentProps {
  patient: Patient;
}

const PatientDemographicsContent = ({ patient }: PatientDemographicsContentProps) => {
  const age = new Date().getFullYear() - new Date(patient.birthDate).getFullYear();
  const hasAllergies = patient.medicalHistory?.allergies && patient.medicalHistory.allergies.length > 0;
  const hasAdjustments = patient.reasonableAdjustments?.hasAdjustments;

  return (
    <div className="space-y-6 pb-6">
      {/* Basic Demographics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg font-semibold">{patient.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">NHS Number</label>
              <p className="font-mono text-lg">{patient.nhsNumber}</p>
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
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {patient.address && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Address
              </label>
              <p>{patient.address}</p>
            </div>
          )}
          {patient.phone && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Phone
              </label>
              <p>{patient.phone}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GP Details */}
      {patient.gpDetails && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              GP Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">GP Name</label>
              <p className="font-medium">{patient.gpDetails.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Practice</label>
              <p>{patient.gpDetails.practice}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p>{patient.gpDetails.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p>{patient.gpDetails.phone}</p>
            </div>
            {patient.gpDetails.email && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{patient.gpDetails.email}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Clinical Flags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Clinical Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <AllergyIndicator allergies={patient.medicalHistory?.allergies} />
            <ReasonableAdjustmentsFlag adjustmentsFlag={patient.reasonableAdjustments} />
            {!hasAllergies && !hasAdjustments && (
              <Badge variant="outline" className="text-green-600">
                No clinical flags
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Allergies Section */}
      {hasAllergies && (
        <PatientDemographicsAllergies allergies={patient.medicalHistory!.allergies!} />
      )}

      {/* Reasonable Adjustments Section */}
      {hasAdjustments && (
        <PatientDemographicsAdjustments adjustmentsFlag={patient.reasonableAdjustments!} />
      )}
    </div>
  );
};

export default PatientDemographicsContent;

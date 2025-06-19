import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { User, Phone, MapPin, Calendar, Shield, Heart, FileText, Clock } from 'lucide-react';
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
  const hasGPDetails = !!patient.gpDetails;

  return (
    <div className="space-y-6 pb-6">
      {/* Patient Summary Card */}
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

      {/* Clinical Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Clinical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <AllergyIndicator allergies={patient.medicalHistory?.allergies} />
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

      {/* GP Information */}
      {hasGPDetails && (
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
                <p className="font-medium">{patient.gpDetails!.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Practice</label>
                <p>{patient.gpDetails!.practice}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Address
              </label>
              <p className="text-sm">{patient.gpDetails!.address}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </label>
                <p className="text-sm">{patient.gpDetails!.phone}</p>
              </div>
              {patient.gpDetails!.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{patient.gpDetails!.email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demographics Details */}
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
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-sm">{patient.address}</p>
                </div>
              )}
            </div>
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

      {/* Record Information */}
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
    </div>
  );
};

export default PatientDemographicsContent;

import { Patient } from '@/types/patient';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { format, differenceInYears } from 'date-fns';
import { Calendar, Phone, Home, Heart, MapPin, FileText } from 'lucide-react';
import AllergyIndicator from '@/components/clinical/AllergyIndicator';
import ReasonableAdjustmentsFlag from '@/components/clinical/ReasonableAdjustmentsFlag';

interface PatientDetailsPopoverProps {
  patient: Patient;
  children: React.ReactNode;
}

const PatientDetailsPopover = ({ patient, children }: PatientDetailsPopoverProps) => {
  const age = differenceInYears(new Date(), new Date(patient.birthDate));
  const hasAllergies = patient.allergies && patient.allergies.length > 0;
  const hasAdjustments = patient.reasonableAdjustments?.hasAdjustments;

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-4" side="right" align="start">
        <div className="space-y-4">
          {/* Patient Header */}
          <div className="flex items-center gap-3 pb-3 border-b">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">NHS: {patient.nhsNumber}</p>
            </div>
          </div>

          {/* Demographics Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4" />
              Demographics
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Date of Birth:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">{format(new Date(patient.birthDate), 'dd/MM/yyyy')} ({age} years)</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Gender:</span>
                <p className="font-medium capitalize mt-1">{patient.gender}</p>
              </div>
            </div>
            
            {patient.phone && (
              <div className="text-sm">
                <span className="text-muted-foreground">Contact:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Phone className="h-3 w-3" />
                  <span className="font-medium">{patient.phone}</span>
                </div>
              </div>
            )}

            {patient.address && (
              <div className="text-sm">
                <span className="text-muted-foreground">Address:</span>
                <div className="flex items-start gap-1 mt-1">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-xs leading-4">{patient.address}</span>
                </div>
              </div>
            )}

            {patient.ethnicity && (
              <div className="text-sm">
                <span className="text-muted-foreground">Ethnicity:</span>
                <p className="font-medium mt-1">{patient.ethnicity}</p>
              </div>
            )}

            {patient.accommodationType && (
              <div className="text-sm">
                <span className="text-muted-foreground">Accommodation:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Home className="h-3 w-3" />
                  <span className="font-medium">{patient.accommodationType}</span>
                </div>
              </div>
            )}
          </div>

          {/* Clinical Alerts Section */}
          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              Clinical Alerts
            </div>
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
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default PatientDetailsPopover;
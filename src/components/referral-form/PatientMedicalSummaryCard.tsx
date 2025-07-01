
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Pill, Activity, FileText } from 'lucide-react';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';

interface PatientMedicalSummaryCardProps {
  patient: Patient;
}

const PatientMedicalSummaryCard = ({ patient }: PatientMedicalSummaryCardProps) => {
  const allergies = patient.medicalHistory?.allergies || [];
  const medications = patient.medications || [];
  const vitalSigns = patient.medicalHistory?.vitalSigns || [];
  const testResults = patient.testResults || [];
  const latestVitals = vitalSigns[0]; // Most recent

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <FileText className="h-5 w-5" />
          Medical Summary for {patient.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Allergies */}
        {allergies.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Allergies ({allergies.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {allergies.slice(0, 4).map((allergy) => (
                <div key={allergy.id} className="bg-red-50 p-2 rounded border border-red-200">
                  <div className="font-medium text-red-800">{allergy.allergen}</div>
                  <div className="text-red-600 text-xs">
                    {allergy.severity} • {allergy.type}
                  </div>
                </div>
              ))}
              {allergies.length > 4 && (
                <div className="text-xs text-muted-foreground">
                  +{allergies.length - 4} more allergies
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Medications */}
        {medications.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Current Medications ({medications.filter(med => med.status === 'active').length})
              </h4>
              <div className="space-y-1">
                {medications.filter(med => med.status === 'active').slice(0, 3).map((medication) => (
                  <div key={medication.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-muted-foreground text-xs">{medication.dosage} - {medication.frequency}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {medication.status}
                    </Badge>
                  </div>
                ))}
                {medications.filter(med => med.status === 'active').length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{medications.filter(med => med.status === 'active').length - 3} more medications
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Latest Vital Signs */}
        {latestVitals && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Latest Vitals
                <Badge variant="outline" className="text-xs">
                  {format(new Date(latestVitals.timestamp), 'dd/MM/yyyy')}
                </Badge>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {latestVitals.bloodPressureSystolic && latestVitals.bloodPressureDiastolic && (
                  <div>
                    <div className="text-muted-foreground">BP</div>
                    <div className="font-medium">
                      {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}
                    </div>
                  </div>
                )}
                {latestVitals.heartRate && (
                  <div>
                    <div className="text-muted-foreground">HR</div>
                    <div className="font-medium">{latestVitals.heartRate}</div>
                  </div>
                )}
                {latestVitals.temperature && (
                  <div>
                    <div className="text-muted-foreground">Temp</div>
                    <div className="font-medium">{latestVitals.temperature}°C</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Recent Test Results */}
        {testResults.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Recent Tests ({testResults.length})
              </h4>
              <div className="space-y-1">
                {testResults.slice(0, 2).map((test) => (
                  <div key={test.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{test.testName}</div>
                      <div className="text-muted-foreground text-xs">
                        {format(new Date(test.requestedDate), 'dd/MM/yyyy')}
                      </div>
                    </div>
                    <Badge variant={test.status === 'completed' ? 'secondary' : 'outline'} className="text-xs">
                      {test.status}
                    </Badge>
                  </div>
                ))}
                {testResults.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{testResults.length - 2} more tests
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* MHA Sections if present */}
        {patient.mhaSections && patient.mhaSections.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                MHA Sections Active
              </h4>
              {patient.mhaSections.slice(0, 1).map((section) => (
                <div key={section.id} className="bg-amber-50 p-2 rounded border border-amber-200">
                  <div className="font-medium text-amber-800">
                    Section {section.sectionNumber}: {section.sectionTitle}
                  </div>
                  <div className="text-amber-600 text-xs">
                    Applied: {format(new Date(section.appliedDate), 'dd/MM/yyyy')}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientMedicalSummaryCard;

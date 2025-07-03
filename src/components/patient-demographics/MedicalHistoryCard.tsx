
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Activity, Pill, FileText, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Patient } from '@/types/patient';

interface MedicalHistoryCardProps {
  patient: Patient;
}

const MedicalHistoryCard = ({ patient }: MedicalHistoryCardProps) => {
  const vitalSigns = patient.medicalHistory?.vitalSigns || [];
  const medications = patient.medicalHistory?.medicationHistory || [];
  const testResults = patient.medicalHistory?.testResults || [];
  const latestVitals = vitalSigns[0]; // Most recent vital signs

  if (!latestVitals && medications.length === 0 && testResults.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" />
          Medical History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Vital Signs */}
        {latestVitals && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Latest Vital Signs
              <Badge variant="outline" className="text-xs">
                {format(new Date(latestVitals.timestamp), 'dd MMM yyyy HH:mm')}
              </Badge>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {latestVitals.bloodPressureSystolic && latestVitals.bloodPressureDiastolic && (
                <div>
                  <div className="text-muted-foreground">Blood Pressure</div>
                  <div className="font-medium">
                    {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic} mmHg
                  </div>
                </div>
              )}
              {latestVitals.heartRate && (
                <div>
                  <div className="text-muted-foreground">Heart Rate</div>
                  <div className="font-medium">{latestVitals.heartRate} bpm</div>
                </div>
              )}
              {latestVitals.temperature && (
                <div>
                  <div className="text-muted-foreground">Temperature</div>
                  <div className="font-medium">{latestVitals.temperature}°C</div>
                </div>
              )}
              {latestVitals.oxygenSaturation && (
                <div>
                  <div className="text-muted-foreground">O2 Saturation</div>
                  <div className="font-medium">{latestVitals.oxygenSaturation}%</div>
                </div>
              )}
              {latestVitals.respiration && (
                <div>
                  <div className="text-muted-foreground">Respiration</div>
                  <div className="font-medium">{latestVitals.respiration}/min</div>
                </div>
              )}
              {latestVitals.news2 && (
                <div>
                  <div className="text-muted-foreground">NEWS2 Score</div>
                  <Badge variant={latestVitals.news2 >= 7 ? 'destructive' : latestVitals.news2 >= 5 ? 'default' : 'secondary'}>
                    {latestVitals.news2}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Medications */}
        {medications.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Current Medications ({medications.filter(med => med.status === 'active').length})
              </h4>
              <div className="space-y-2">
                {medications.filter(med => med.status === 'active').slice(0, 3).map((medication) => (
                  <div key={medication.id} className="flex justify-between items-start text-sm">
                    <div>
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-muted-foreground">{medication.dosage} - {medication.frequency}</div>
                      {medication.indication && (
                        <div className="text-xs text-muted-foreground">For: {medication.indication}</div>
                      )}
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

        {/* Recent Test Results */}
        {testResults.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Recent Test Results ({testResults.length})
              </h4>
              <div className="space-y-2">
                {testResults.slice(0, 3).map((test) => (
                  <div key={test.id} className="flex justify-between items-start text-sm">
                    <div>
                      <div className="font-medium">{test.testName}</div>
                      <div className="text-muted-foreground">
                        {format(new Date(test.requestedDate), 'dd MMM yyyy')}
                        {test.reportDate && ` • Reported: ${format(new Date(test.reportDate), 'dd MMM yyyy')}`}
                      </div>
                      {test.interpretation && (
                        <div className="text-xs text-muted-foreground">{test.interpretation}</div>
                      )}
                    </div>
                    <Badge variant={test.status === 'completed' ? 'secondary' : 'outline'} className="text-xs">
                      {test.status}
                    </Badge>
                  </div>
                ))}
                {testResults.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{testResults.length - 3} more test results
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* MHA Sections if present */}
        {patient.medicalHistory?.mhaSections && patient.medicalHistory.mhaSections.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                Mental Health Act Sections
              </h4>
              <div className="space-y-2">
                {patient.medicalHistory.mhaSections.map((section) => (
                  <div key={section.id} className="flex justify-between items-start text-sm bg-amber-50 p-2 rounded">
                    <div>
                      <div className="font-medium">Section {section.sectionNumber}: {section.sectionTitle}</div>
                      <div className="text-muted-foreground">
                        Applied: {format(new Date(section.appliedDate), 'dd MMM yyyy')}
                        {section.expiryDate && ` • Expires: ${format(new Date(section.expiryDate), 'dd MMM yyyy')}`}
                      </div>
                      <div className="text-xs text-muted-foreground">{section.hospital}</div>
                    </div>
                    <Badge variant={section.status === 'active' ? 'destructive' : 'secondary'} className="text-xs">
                      {section.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalHistoryCard;

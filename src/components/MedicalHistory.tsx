
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Patient } from '@/types/patient';
import VitalSignsTab from './medical-history/VitalSignsTab';
import TestResultsTab from './medical-history/TestResultsTab';
import MedicationHistoryTab from './medical-history/MedicationHistoryTab';
import MHATab from './medical-history/MHATab';

interface MedicalHistoryProps {
  patient: Patient;
}

const MedicalHistory = ({ patient }: MedicalHistoryProps) => {
  if (!patient.medicalHistory) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Medical History</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm">No medical history available for this patient.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Medical History</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 overflow-hidden">
        <Tabs defaultValue="vitals" className="space-y-3">
          <div className="mb-3">
            <TabsList variant="default">
              <TabsTrigger value="vitals" variant="default">
                Vital Signs
              </TabsTrigger>
              <TabsTrigger value="test-results" variant="default">
                Test Results
              </TabsTrigger>
              <TabsTrigger value="medications" variant="default">
                Medication History
              </TabsTrigger>
              <TabsTrigger value="mha" variant="default">
                MHA
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="vitals">
            <VitalSignsTab vitalSigns={patient.medicalHistory.vitalSigns} />
          </TabsContent>

          <TabsContent value="test-results">
            <TestResultsTab testResults={patient.medicalHistory.testResults} />
          </TabsContent>

          <TabsContent value="medications">
            <MedicationHistoryTab medicationHistory={patient.medicalHistory.medicationHistory} />
          </TabsContent>

          <TabsContent value="mha">
            <MHATab mhaSections={patient.medicalHistory.mhaSections} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalHistory;
